import { Router } from 'express';
import { credits, signIn } from '../controller/user.controller.js';

import { authorization } from '../middleware/authorization.middleware.js';
const userRouter = Router();

userRouter.post('/sign-in', signIn);
userRouter.get('/credits', authorization, credits);

export default userRouter;
