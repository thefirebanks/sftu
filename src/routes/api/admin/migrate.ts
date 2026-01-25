import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
const appSchemaSql = `
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  expiresAt TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  userId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS session_user_id_idx
  ON session (userId);

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt TEXT,
  refreshTokenExpiresAt TEXT,
  scope TEXT,
  password TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS account_user_id_idx
  ON account (userId);

CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS verification_identifier_idx
  ON verification (identifier);

CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  normalized_address TEXT NOT NULL,
  neighborhood TEXT,
  lat REAL,
  lng REAL,
  management_company TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS buildings_normalized_address_idx
  ON buildings (normalized_address);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  building_id TEXT NOT NULL,
  unit TEXT,
  title TEXT,
  description TEXT,
  price INTEGER,
  beds INTEGER,
  baths INTEGER,
  sqft INTEGER,
  status TEXT,
  source TEXT NOT NULL,
  source_id TEXT NOT NULL,
  url TEXT,
  posted_at TEXT,
  last_seen_at TEXT,
  saves_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS listings_source_source_id_idx
  ON listings (source, source_id);

CREATE INDEX IF NOT EXISTS listings_building_id_idx
  ON listings (building_id);

CREATE TABLE IF NOT EXISTS listing_photos (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

CREATE INDEX IF NOT EXISTS listing_photos_listing_id_idx
  ON listing_photos (listing_id);

CREATE TABLE IF NOT EXISTS listing_saves (
  user_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, listing_id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

CREATE INDEX IF NOT EXISTS listing_saves_listing_id_idx
  ON listing_saves (listing_id);

CREATE TABLE IF NOT EXISTS public_records (
  id TEXT PRIMARY KEY,
  building_id TEXT NOT NULL,
  record_type TEXT NOT NULL,
  source TEXT NOT NULL,
  record_date TEXT,
  status TEXT,
  summary TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE INDEX IF NOT EXISTS public_records_building_id_idx
  ON public_records (building_id);
`

export const Route = createFileRoute('/api/admin/migrate')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const secret = request.headers.get('x-migrate-secret')
        if (!secret || secret !== env.BETTER_AUTH_SECRET) {
          return json({ error: 'Unauthorized' }, { status: 401 })
        }
        await env.DB.exec(appSchemaSql)

        return json({
          authTablesCreated: ['user', 'session', 'account', 'verification'],
          authFieldsAdded: [],
          appSchema: 'applied',
        })
      },
    },
  },
})
