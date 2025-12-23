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
    const col = db.collection('driverMeta');

    if (req.method === 'GET') {
      const doc = await col.findOne({});
      res.status(200).json({ meta: doc?.meta ?? {} });
      return;
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      const { meta } = body || {};
      if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
        res.status(400).json({ error: 'Invalid payload: meta must be an object keyed by driver names' });
        return;
      }
      await col.deleteMany({});
      await col.insertOne({ meta });
      res.status(200).json({ meta });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /api/driverMeta error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
