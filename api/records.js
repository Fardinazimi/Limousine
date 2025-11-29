// api/records.js
import { getDb } from './_db.js';

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const col = db.collection('records');

    if (req.method === 'GET') {
      const doc = await col.findOne({ _id: 'records_list' });
      const records = doc?.records || [];
      return res.status(200).json({ records });
    }

    if (req.method === 'POST') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
      const records = Array.isArray(body.records) ? body.records : [];
      await col.updateOne(
        { _id: 'records_list' },
        { $set: { records } },
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
