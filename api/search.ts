import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_API_KEY ?? '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const body = JSON.stringify(req.body);

  const options: https.RequestOptions = {
    hostname: 'breach.vip',
    path: '/api/search',
    method: 'POST',
    headers: {
      ...headers,
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise<void>((resolve) => {
    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', (chunk) => { data += chunk; });
      proxyRes.on('end', () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(proxyRes.statusCode ?? 200).send(data);
        resolve();
      });
    });

    proxyReq.on('error', (err) => {
      res.status(502).json({ error: 'Upstream error', detail: err.message });
      resolve();
    });

    proxyReq.write(body);
    proxyReq.end();
  });
}
