// Vercel serverless MongoDB helper using native driver with global cache
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) {
  console.error('Missing MONGODB_URI/MONGO_URI in environment');
}

let cached = global._mongoClientCache;
if (!cached) {
  cached = global._mongoClientCache = { client: null, promise: null };
}

export async function getClient() {
  if (cached.client) return cached.client;
  if (!cached.promise) {
    cached.promise = (async () => {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 20000 });
      await client.connect();
      return client;
    })();
  }
  cached.client = await cached.promise;
  return cached.client;
}

export async function getDb() {
  const client = await getClient();
  // Optional separate DB name via env; otherwise use default in URI
  const dbName = process.env.DB_NAME || undefined;
  return dbName ? client.db(dbName) : client.db();
}
