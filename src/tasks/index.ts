import cron from 'node-cron';

import { cleanExpiredTokens } from '../services/authService';

/*
    cron guide:
    * * * * *
    Position 1: Minutes (0-59)
    Position 2: Hours (0-23)
    Position 3: Day of the month (1-31)
    Position 4: Month (1-12)
    Position 5: Day of the week (0-6, where Sunday is 0 or 7)
*/

// include all cron tasks here
export const registerTasks = () => {
    // Schedule to run at midnight every day
    cron.schedule('0 0 * * *', async () => {
        console.log('Running cleanExpiredTokens function...');
        try {
            await cleanExpiredTokens();
            console.log('Expired tokens cleaned up!');
        } catch (error) {
            console.error('Error cleaning up expired tokens:', error);
        }
    });

};