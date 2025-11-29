// api/_db.js
import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function getDb() {
  if (cachedDb && cachedClient) return cachedDb;
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'limousine_db';
  if (!uri) {
    throw new Error('Missing MONGODB_URI env var');
  }
  const client = new MongoClient(uri, {
    maxPoolSize: 5,
  });
  await client.connect();
  cachedClient = client;
  cachedDb = client.db(dbName);
  return cachedDb;
}
