import express from 'express';
import cors from 'cors';
import './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Campus Bakery POS server running on http://localhost:${PORT}`);
});
