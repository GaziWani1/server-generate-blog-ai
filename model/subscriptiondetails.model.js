import { Schema, model } from 'mongoose';

const subscriptiondetail = new Schema({
  id: { type: String, required: true },
  object: { type: String, default: 'product' },
  active: { type: Boolean, default: true },
  description: { type: String },
  livemode: { type: Boolean, default: false },
  name: { type: String, required: true },
  type: { type: String, default: 'service' },
  created: { type: Number },
});

subscriptiondetail.index({ id: 1 });

export default model('subscriptiondetail', subscriptiondetail);
