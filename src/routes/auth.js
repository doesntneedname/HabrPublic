import express from 'express';
import { getAuthUrl, exchangeCode } from '../lib/habrApi.js';

const router = express.Router();

router.get('/', (_, res) => {
  res.send(`Login to Habr Career <a href='/login'>Login</a>`);
});

router.get('/login', (_, res) => {
  console.log('REDIRECT_URI in env:', process.env.REDIRECT_URI);
  console.log('getAuthUrl() result:', getAuthUrl());
  res.redirect(getAuthUrl());
});

router.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.send(`Error: ${error}`);
  try {
    await exchangeCode(code);
    res.redirect('/vacancies');
  } catch (e) {
    res.send(`Error: ${e.message}`);
  }
});

export default router;
