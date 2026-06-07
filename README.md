# MuseAI Proxy

Serverless proxy for MuseAI music generation. Deployed on Vercel.

## Endpoints
- GET  /api/          — health check
- POST /api/generate  — create Replicate prediction
- GET  /api/poll?id=X&replicate_key=Y — poll prediction status
