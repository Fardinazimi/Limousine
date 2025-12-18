import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import Drivers from './models/Drivers.js';
import Records from './models/Records.js';
import DriverMeta from './models/DriverMeta.js';

dotenv.config();

const app = express();
app.use(cors());
// HTTP request logging
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Drivers endpoints
app.get('/api/drivers', async (_req, res) => {
  try {
    const doc = await Drivers.findOne({}).lean();
    res.json({ drivers: doc?.drivers ?? [] });
  } catch (err) {
    console.error('GET /api/drivers error:', err);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

app.post('/api/drivers', async (req, res) => {
  try {
    const { drivers } = req.body || {};
    console.log('[POST /api/drivers] Incoming payload size:', Array.isArray(drivers) ? drivers.length : 'N/A');
    if (!Array.isArray(drivers) || !drivers.every((d) => typeof d === 'string')) {
      return res.status(400).json({ error: 'Invalid payload: drivers must be an array of strings' });
    }

    // Replace entire collection (single-document collection approach)
    console.log('[POST /api/drivers] Replacing drivers collection...');
    await Drivers.deleteMany({});
    const created = await Drivers.create({ drivers });
    console.log('[POST /api/drivers] Saved drivers count:', created.drivers?.length ?? 0);
    res.json({ drivers: created.drivers });
  } catch (err) {
    console.error('POST /api/drivers error:', err);
    res.status(500).json({ error: 'Failed to save drivers' });
  }
});

// Records endpoints
app.get('/api/records', async (_req, res) => {
  try {
    const doc = await Records.findOne({}).lean();
    res.json({ records: doc?.records ?? [] });
  } catch (err) {
    console.error('GET /api/records error:', err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

app.post('/api/records', async (req, res) => {
  try {
    const { records } = req.body || {};
    console.log('[POST /api/records] Incoming payload size:', Array.isArray(records) ? records.length : 'N/A');
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid payload: records must be an array' });
    }

    console.log('[POST /api/records] Replacing records collection...');
    await Records.deleteMany({});
    const created = await Records.create({ records });
    console.log('[POST /api/records] Saved records count:', created.records?.length ?? 0);
    res.json({ records: created.records });
  } catch (err) {
    console.error('POST /api/records error:', err);
    res.status(500).json({ error: 'Failed to save records' });
  }
});

// Driver meta endpoints
app.get('/api/driverMeta', async (_req, res) => {
  try {
    const doc = await DriverMeta.findOne({}).lean();
    res.json({ meta: doc?.meta ?? {} });
  } catch (err) {
    console.error('GET /api/driverMeta error:', err);
    res.status(500).json({ error: 'Failed to fetch driver meta' });
  }
});

app.post('/api/driverMeta', async (req, res) => {
  try {
    const { meta } = req.body || {};
    console.log('[POST /api/driverMeta] Incoming keys:', meta && typeof meta === 'object' && !Array.isArray(meta) ? Object.keys(meta).length : 'N/A');
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
      return res.status(400).json({ error: 'Invalid payload: meta must be an object keyed by driver names' });
    }

    console.log('[POST /api/driverMeta] Replacing driverMeta collection...');
    await DriverMeta.deleteMany({});
    const created = await DriverMeta.create({ meta });
    console.log('[POST /api/driverMeta] Saved meta keys:', created.meta ? Object.keys(created.meta).length : 0);
    res.json({ meta: created.meta });
  } catch (err) {
    console.error('POST /api/driverMeta error:', err);
    res.status(500).json({ error: 'Failed to save driver meta' });
  }
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment');
  process.exit(1);
}

// Log Mongoose queries in the console for debugging
mongoose.set('debug', true);

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
