import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import vacanciesRoutes from './src/routes/vacancies.js';
import { startCronJobs } from './src/cron/jobs.js';

dotenv.config();

const app = express();

app.use('/', authRoutes);
app.use('/vacancies', vacanciesRoutes);

startCronJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(process.env.SERVER_URL);
});
