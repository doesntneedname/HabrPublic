import cron from 'node-cron';
import axios from 'axios';
import { clearCache } from '../lib/cache.js';

export function startCronJobs() {
  cron.schedule('*/5 * * * *', () => {
    console.log('Cron: fetching vacancies');
    axios.get(`${process.env.SERVER_URL}/vacancies`);
  });

  cron.schedule('0 0 * * *', () => clearCache(), {
    timezone: 'Europe/Moscow'
  });
}
