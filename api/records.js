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
    const col = db.collection('records');

    if (req.method === 'GET') {
      const doc = await col.findOne({});
      res.status(200).json({ records: doc?.records ?? [] });
      return;
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      const { records } = body || {};
      if (!Array.isArray(records)) {
        res.status(400).json({ error: 'Invalid payload: records must be an array' });
        return;
      }
      await col.deleteMany({});
      await col.insertOne({ records });
      res.status(200).json({ records });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /api/records error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
