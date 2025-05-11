import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEY } from '../config/env.js';
import storyModel from '../model/story.model.js';

export const genAI = new GoogleGenerativeAI(API_KEY);
export const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const createStory = async (req, res) => {
  try {
    const { storyType, duration, storyAbout, timeUnit } = req.body;

    if (duration > 15 && timeUnit === 'minute') {
      throw new Error('Story Duration Should Be Only for 15 Mins Or Less');
    }
    if (!storyType || !duration || !storyAbout) {
      return res
        .status(400)
        .json({ error: 'storyType, duration, and storyAbout are required' });
    }

    let prompt = `Write a complete ${storyType} story in plain text that would take about ${duration} ${timeUnit} to read. The story should be about ${storyAbout}. Avoid any formatting or explanations — just give the story itself.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const story = new storyModel({
      category: storyAbout,
      duration,
      title: storyAbout,
      timeUnit,
      story: text,
      createdBy: req.user._id,
    });

    await story.save();

    return res.json({
      data: story,
      message: 'Story Is Generated Successfully',
    });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
};
