# Limousine Backend (Express + MongoDB Atlas)

Implements API for drivers, weekly records, and driver metadata to match the React frontend.

## Endpoints

- `GET /api/health` → `{ ok: true }`
- `GET /api/drivers` → `{ drivers: ["name1", "name2", ...] }`
- `POST /api/drivers` → `{ drivers: [...] }` (replaces entire collection)
- `GET /api/records` → `{ records: [ {...}, {...} ] }`
- `POST /api/records` → `{ records: [...] }` (replaces entire collection)
- `GET /api/driverMeta` → `{ meta: { driverName: { defaultShift, carPlate, carModel }, ... } }`
- `POST /api/driverMeta` → `{ meta: { ... } }` (replaces entire collection)

## Data Model

Each resource is a single-document collection:

- `Drivers` → `{ drivers: string[] }`
- `Records` → `{ records: Record[] }`
- `DriverMeta` → `{ meta: { [driverName: string]: { defaultShift, carPlate, carModel } } }`

This matches the frontend pattern of replacing all data for each resource.

## Getting Started

1. Copy `.env.example` to `.env` and set `MONGO_URI`:

```bash
cp server/.env.example server/.env
# edit server/.env and set MONGO_URI
```

2. Install dependencies:

```bash
npm install --prefix server
```

3. Run locally:

```bash
npm run dev --prefix server
```

Server listens on `PORT` (default 5000).

## Deploying

- Ensure `MONGO_URI` is set as an environment variable.
- Use Node 18+ runtime.

### Render

- Create a new Web Service.
- Root directory: `server/`
- Build Command: `npm install`
- Start Command: `npm start`
- Add environment variable `MONGO_URI`.

### Railway

- Create a new Service from repo.
- Set service root to `server/`.
- Add variable `MONGO_URI`.
- Start Command: `npm start`.

## Notes

- CORS is enabled for all origins by default. You can restrict via:
  - `app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') }))`
- POST endpoints fully replace the resource for simplicity to match the frontend. Transition to granular updates later if needed.
