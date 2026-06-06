const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'MuseAI proxy running' }));

// Create prediction
app.post('/generate', async (req, res) => {
  const { replicate_key, prompt, duration, continuation, input_audio } = req.body;
  if (!replicate_key) return res.status(400).json({ error: 'No API key provided' });
  const input = { prompt, duration: duration || 30, model_version: 'stereo-large', output_format: 'wav', normalization_strategy: 'peak' };
  if (continuation && input_audio) { input.continuation = true; input.input_audio = input_audio; }
  try {
    const r = await fetch('https://api.replicate.com/v1/models/meta/musicgen/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${replicate_key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const data = await r.json();
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Poll prediction
app.get('/poll/:id', async (req, res) => {
  const { replicate_key } = req.query;
  if (!replicate_key) return res.status(400).json({ error: 'No API key' });
  try {
    const r = await fetch(`https://api.replicate.com/v1/predictions/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${replicate_key}` }
    });
    res.json(await r.json());
  } catch(e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MuseAI proxy running on port ${PORT}`));
