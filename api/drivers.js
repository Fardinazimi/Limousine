import { getDb } from './_mongo.js';

async function parseBody(req) {
  if (req.body) return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const col = db.collection('drivers');

    if (req.method === 'GET') {
      const doc = await col.findOne({});
      res.status(200).json({ drivers: doc?.drivers ?? [] });
      return;
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      const { drivers } = body || {};
      if (!Array.isArray(drivers) || !drivers.every((d) => typeof d === 'string')) {
        res.status(400).json({ error: 'Invalid payload: drivers must be an array of strings' });
        return;
      }
      await col.deleteMany({});
      const created = await col.insertOne({ drivers });
      res.status(200).json({ drivers });
      return;
    }

    // Method not allowed
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /api/drivers error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
