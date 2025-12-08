import express from 'express';
import cors from 'cors';
import prisma from './lib/prisma';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'skillset-backend' });
});

app.get('/debug/skills', async (_req, res) => {
  const skills = await prisma.skill.findMany();
  res.json(skills);
});

export default app;
