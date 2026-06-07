export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: 'MuseAI proxy running on Vercel', version: '1.0' });
}
