import { Router } from 'express';
import { signIn } from '../controller/user.controller.js';

const userRouter = Router();

userRouter.get('/signin', signIn);

export default userRouter;
