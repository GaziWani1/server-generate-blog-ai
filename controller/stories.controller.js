import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEY } from '../config/env.js';
import blogModel from '../model/blog.model.js';
import userModel from '../model/user.model.js';

export const genAI = new GoogleGenerativeAI(API_KEY);
export const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const createBlog = async (req, res) => {
  try {
    const { blogType, readingTime, blogAbout, timeUnit } = req.body;

    const user = await userModel.findById(req.user._id);

    if (user.credits < 3) {
      throw new Error(
        'Insufficient credits. You can generate up to 4 blogs per day for free. Your credits will renew daily.'
      );
    }

    if (!blogType || !readingTime || !blogAbout) {
      return res.status(400).json({
        error:
          'blogType, readingTime, blogAbout, and blogCategory are required',
      });
    }

    let prompt = `Write a detailed, well-structured, and engaging ${blogType} blog post titled "${blogAbout}". The content should be formatted in Markdown using a README-style layout, with clear sections, headings (e.g., #, ##, ###), bullet points, blockquotes, bold/italic highlights, and to ensure readability.

The blog should take approximately ${1} ${timeUnit} to read. Start with a compelling title and a concise description, followed by a strong introduction. Then break the main body into logically organized sections with subheadings. Each section should have for readability, and include highlights like:
- Lists for key points
- Quotes for emphasis
- Bold/italic for important terms

End with a thoughtful and inspiring conclusion. Use line breaks between each major section and paragraph. The tone should be professional yet friendly, avoiding technical jargon unless necessary, and keeping it accessible for a broad audience. Prioritize clarity, creativity, and usefulness.`;

    // Generate the blog content using the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Saving the generated blog to the database
    const blog = new blogModel({
      readingTime,
      title: blogAbout,
      category: blogType,
      timeUnit,
      blog: text,
      createdBy: req.user._id,
    });

    user.credits -= 3;
    await user.save();

    await blog.save();

    return res.json({
      data: blog,
      message: 'Blog Generated Successfully!',
    });
  } catch (error) {
    console.error('Error fetching user blogs:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    // parse pagination params from querystring, with defaults
    const search = req.query.search;
    const page = parseInt(req.query.page, 8) || 1;
    const limit = parseInt(req.query.limit, 8) || 8;
    const skip = (page - 1) * limit;

    // base filter
    const filter = { createdBy: req.user._id };

    // if search is provided, add regex filter for title or other fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } }, // case-insensitive search
        // { content: { $regex: search, $options: 'i' } }, // optionally add more fields
      ];
    }

    // run both queries in parallel
    const [totalItems, userBlogs] = await Promise.all([
      blogModel.countDocuments(filter),
      blogModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      userBlogs,
      meta: {
        totalItems,
        totalPages,
        page,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const deleteBlog = async (req, res) => {
  const _id = req.params.id;
  try {
    await blogModel.deleteOne({
      _id,
    });
    return res.status(204).json({
      message: 'Blog Deleted Successfully',
    });
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const getBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await blogModel.findById(id);
    return res.status(200).json({
      blog,
    });
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.pageLimit, 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }, // optional, based on your schema
      ];
    }

    const [totalItems, userBlogs] = await Promise.all([
      blogModel.countDocuments(filter),
      blogModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      userBlogs,
      meta: {
        totalItems,
        totalPages,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const likeBlog = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;
    const like = req.query.like === '1';

    const update = like
      ? {
          $addToSet: { likedBy: userId },
        }
      : {
          $pull: { likedBy: userId },
        };

    const updatedBlog = await blogModel.findByIdAndUpdate(blogId, update, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update likes count based on current likedBy array length
    updatedBlog.likes = updatedBlog.likedBy.length;
    await updatedBlog.save();

    return res.status(200).json({
      message: like ? 'Liked successfully' : 'Unliked successfully',
      likes: updatedBlog.likes,
    });
  } catch (error) {
    next(error);
  }
};
