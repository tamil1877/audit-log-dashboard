# Audit Log Dashboard

A dashboard for security engineers to upload, view, filter, search, sort and
paginate system audit logs. Built for the Gidy full stack exercise.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React (Vite), Tailwind CSS

## Project structure

```
gidy-audit-dashboard/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/Log.js         # Log schema + indexes
│   ├── controllers/          # Route logic (bulk upload, query, facets)
│   ├── routes/logs.js        # API routes
│   ├── scripts/seed.js       # Generates 10k fake logs for testing
│   └── server.js             # Express app entry point
└── frontend/
    ├── src/
    │   ├── components/       # FilterBar, LogsTable, Pagination, UploadPanel
    │   ├── api.js             # Fetch calls to the backend
    │   └── App.jsx
    └── index.html
```

## Setup

### 1. MongoDB Atlas (free tier)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user (username + password).
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) for testing.
4. Under **Connect > Drivers**, copy the connection string.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# paste your MongoDB connection string into .env as MONGO_URI
npm run dev
```

Server runs on `http://localhost:5000`.

To populate the database with 10,000 test log records (do this after the
server is running):

```bash
npm run seed
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## Technical decisions

- **`insertMany` for bulk upload, not a loop of individual `.save()` calls.**
  Saving 10,000 documents one at a time means 10,000 separate round trips to
  MongoDB. `insertMany` batches them into far fewer operations, which is the
  only way "10,000 records in a single request" is actually feasible within
  a reasonable response time. Ran with `ordered: false` so one malformed
  record doesn't abort the entire batch.

- **All filtering, searching, sorting and pagination happen in the MongoDB
  query, not in JavaScript after fetching.** The exercise explicitly calls
  this out. Loading 10k+ documents into memory and slicing them in Node
  would work at small scale but falls apart as the collection grows —
  it's also just wasted transfer, since the client only ever needs one
  page of results at a time.

- **Indexes on `severity`, `status`, `region`, `timestamp`, and `actor`,**
  since those are the fields actually used in `$find` queries and sorts.
  A compound text index across `actor`, `action`, and `resource` powers
  the search box in a single query instead of running separate regex
  matches per field, which doesn't scale and can't use an index at all.

- **Pagination limit is capped server-side at 100 per page,** regardless of
  what the client requests. Nothing stops a client from requesting
  `limit=10000` and defeating the point of pagination — the server should
  enforce this, not just the UI.

- **`facets` endpoint returns real distinct values from the data** (regions,
  severities, statuses, roles) rather than hardcoding a dropdown list in the
  frontend. If new regions or statuses show up in the data later, the filter
  UI reflects that automatically instead of drifting out of sync.

- **Dark, monospace-leaning UI.** Log/audit tooling is read for long
  stretches and scanned quickly for anomalies (a SOC-style dashboard), so a
  dark background with a monospace type for the data columns and clear
  color-coded severity badges was a closer fit than a generic light admin
  theme.

## API

| Method | Endpoint            | Description                                   |
|--------|----------------------|------------------------------------------------|
| POST   | `/api/logs/bulk`     | Accepts an array of log records, bulk inserts  |
| GET    | `/api/logs`          | Filter/search/sort/paginate logs (query params)|
| GET    | `/api/logs/facets`   | Distinct values for filter dropdowns           |

`GET /api/logs` query params: `search`, `actor`, `role`, `action`, `region`,
`severity`, `status`, `from`, `to`, `sortBy`, `order`, `page`, `limit`.
