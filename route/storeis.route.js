import { Router } from 'express';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  getUserBlogs,
  likeBlog,
} from '../controller/stories.controller.js';
import { authorization } from '../middleware/authorization.middleware.js';
const storyRouter = Router();

storyRouter.post('/create', authorization, createBlog);
storyRouter.get('/user-blogs', authorization, getUserBlogs);
storyRouter.delete('/user-blog/:id', authorization, deleteBlog);
storyRouter.get('/user-blog/:id', getBlog);
storyRouter.get('/get-all-blogs', getAllBlogs);
storyRouter.patch('/like-blog/:id', authorization, likeBlog);

export default storyRouter;
