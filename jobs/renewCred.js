// cron/creditReset.js
import cron from 'node-cron';
import userModel from '../model/user.model.js';

// Run every day at 12:00 AM (midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const result = await userModel.updateMany({}, { $set: { credits: 12 } });
    console.log(
      `[CREDITS RESET] ${result.modifiedCount} users updated at midnight`
    );
  } catch (error) {
    console.error('Error resetting credits:', error);
  }
});
