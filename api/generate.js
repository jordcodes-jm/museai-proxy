export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { replicate_key, prompt, duration, continuation, input_audio } = req.body;
  if (!replicate_key) return res.status(400).json({ error: 'No API key provided' });

  const input = {
    prompt,
    duration: duration || 30,
    model_version: 'stereo-large',
    output_format: 'wav',
    normalization_strategy: 'peak'
  };
  if (continuation && input_audio) {
    input.continuation = true;
    input.input_audio = input_audio;
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/models/meta/musicgen/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicate_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
