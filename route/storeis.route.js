import { Router } from 'express';
import { createStory } from '../controller/stories.controller.js';
import { authorization } from '../middleware/authorization.middleware.js';
const storyRouter = Router();

storyRouter.post('/create', authorization, createStory);

export default storyRouter;
