import express from 'express';
import { processVacancies } from '../lib/habrApi.js';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const newResponses = await processVacancies();
    res.json(newResponses);
  } catch (e) {
    res.status(500).send(`Error: ${e.message}`);
  }
});

export default router;
