# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SFTU is a rental discovery web application for San Francisco that aggregates listings and enriches them with public records (DBI inspections, violations, permits). The goal is to help renters evaluate buildings and management companies.

## Commands

```bash
pnpm dev              # Start dev server on port 3000
pnpm build            # Build for production
pnpm test             # Run tests with Vitest
pnpm deploy           # Build and deploy to Cloudflare Workers
pnpm cf-typegen       # Generate types from Cloudflare bindings
```

## Architecture

**Stack**: TanStack Start + React 19 + TypeScript, deployed on Cloudflare Workers with D1 (SQLite) database.

### Key Directories
- `src/routes/` - TanStack Router file-based routing (SSR-capable)
- `src/lib/auth.ts` - Better Auth server configuration
- `src/lib/auth-client.ts` - Client-side auth hooks
- `src/data/` - Mock data (to be replaced with D1 queries)
- `migrations/` - D1 database migrations

### Data Flow
1. Routes use `Route.loader()` for server-side data fetching
2. Server functions created via `createServerFn()` from `@tanstack/react-start`
3. Database access via Kysely ORM with `kysely-d1` dialect
4. Auth handled by Better Auth with Google OAuth (routes at `/api/auth/$`)

### Database Schema
- **Auth tables** (Better Auth managed): user, session, account, verification
- **App tables**: buildings, listings, listing_photos, listing_saves, public_records
- See `SCHEMA.md` for full field definitions

### Auth Gate Pattern
First 6 listings visible to anonymous users; full access requires authentication via `authClient.useSession()`.

## Key Files

- `VISION.md` - Product goals and architecture decisions
- `LISTINGS_REDESIGN.md` - UI redesign roadmap with design tokens
- `src/routes/listings.tsx` - Main listings page implementation
- `wrangler.jsonc` - Cloudflare Workers configuration with D1 binding

## Styling

Tailwind CSS v4 with CSS variables for design tokens. Key tokens defined in `src/styles.css`:
- Colors: `--ink`, `--muted`, `--plum`, `--sea`, `--sky`, `--sun`, `--sand`, `--fog`
- Surfaces: `--surface`, `--surface-raised`, `--border`

## Environment Variables

See `.env.example`:
- `BETTER_AUTH_SECRET` - Auth secret key
- `BETTER_AUTH_URL` - Auth base URL
- Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
