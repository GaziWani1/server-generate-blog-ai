import { Router } from 'express';
import { signIn } from '../controller/user.controller.js';

const userRouter = Router();

userRouter.post('/sign-in', signIn);

export default userRouter;
