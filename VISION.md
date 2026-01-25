# Vision

Build a focused, high-trust rental discovery product for San Francisco that aggregates listings, enriches them with public records, and makes it easy to evaluate buildings and management companies. The goal is a fast, reliable POC that can expand to additional markets and deeper features later.

## Product goals (POC)
- Aggregate listings from external sources into a single, deduplicated catalog.
- Show listings on a map with lightweight filtering and quick detail views.
- Enrich listings with government and DBI records for context and credibility.
- Provide a simple landing experience; require auth to go beyond the first page.

## Users and primary use cases
- Renters in San Francisco who want to compare listings and avoid problematic buildings.
- Users who want a single place to browse listings and related records.

## Scope

### V1 (POC)
- Listings ingestion via a separate scraper service that writes directly to the database.
- Listing deduplication using address normalization and source identifiers.
- Map-first browsing with a simple listing detail view.
- Government / DBI records attached to listings.
- Auth gate after the first page of browsing.

### V2 (future)
- Email verification and verified tenant reviews.
- User saves and basic personalization.
- Public posting submissions.
- Natural language search + AI tagging and descriptions.

## Data sources
- Listings: external sources ingested by the scraper service.
- Public records: city and DBI datasets for inspections, violations, permits, and ownership when available.

## High-level architecture
- Frontend: TanStack Start + React + TypeScript.
- Backend: Cloudflare Workers with app routes (TanStack server or Hono).
- Database: Cloudflare D1.
- Auth: Better Auth on Cloudflare.
- Scraper service: separate non-Cloudflare server that writes directly to D1.

## Core entities (high level)
- Listing (address, unit, price, beds/baths, coordinates, source IDs)
- Building (normalized address, geo, management company)
- PublicRecord (type, source, date, metadata)
- User (auth identity, saved listings)

## Deduplication strategy (high level)
- Normalize address strings and geocode to a canonical building.
- Merge listings that share a building and near-identical unit metadata.
- Retain source-specific identifiers for traceability.

## UX flow (high level)
- Public landing page and first listing page view without auth.
- Require login to continue browsing or view full details.
- Map-centric browsing with quick detail drawer for listings.

## Non-goals for POC
- Messaging between users.
- Analytics and growth tooling.
- Full-text or semantic search.

## Rollout plan (high level)
1. Database schema + ingestion pipeline.
2. Map browsing + listing detail views.
3. Public records integration.
4. Auth gate after first page.
