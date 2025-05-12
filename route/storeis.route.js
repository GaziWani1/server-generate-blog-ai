import { Router } from 'express';
import {
  createBlog,
  deleteBlog,
  getUserBlogs,
} from '../controller/stories.controller.js';
import { authorization } from '../middleware/authorization.middleware.js';
const storyRouter = Router();

storyRouter.post('/create', authorization, createBlog);
storyRouter.get('/user-blogs', authorization, getUserBlogs);
storyRouter.delete('/user-blog/:id', authorization, deleteBlog);

export default storyRouter;
