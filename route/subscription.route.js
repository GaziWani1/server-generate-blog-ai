import { Router } from 'express';

import {
  getSubscriptionDetails,
  subscription,
} from '../controller/subscription.controller.js';

import { authorization } from '../middleware/authorization.middleware.js';
const subscriptionRouter = Router();
subscriptionRouter.get('/get-subs', getSubscriptionDetails);

subscriptionRouter.post('/user-subscription', subscription);

export default subscriptionRouter;
