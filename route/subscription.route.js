import { Router } from 'express';

import {
  getCurrentSubscriptions,
  getSubscriptionDetails,
  subscription,
} from '../controller/subscription.controller.js';

import { authorization } from '../middleware/authorization.middleware.js';
const subscriptionRouter = Router();
subscriptionRouter.get('/get-subs', getSubscriptionDetails);

subscriptionRouter.post('/user-subscription', authorization, subscription);
subscriptionRouter.get(
  '/user-subscription',
  authorization,
  getCurrentSubscriptions
);

export default subscriptionRouter;
