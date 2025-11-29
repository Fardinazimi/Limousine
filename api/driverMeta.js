// api/driverMeta.js
import { getDb } from './_db.js';

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const col = db.collection('driver_meta');

    if (req.method === 'GET') {
      const doc = await col.findOne({ _id: 'meta' });
      const meta = doc?.meta || {};
      return res.status(200).json({ meta });
    }

    if (req.method === 'POST') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
      const meta = body && typeof body.meta === 'object' ? body.meta : {};
      await col.updateOne(
        { _id: 'meta' },
        { $set: { meta } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
