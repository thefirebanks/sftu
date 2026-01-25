# Database Schema (POC)

This captures the minimal tables needed for the POC. Better Auth manages its own tables; the rest support listings, public records, and saves.

## Auth (Better Auth)
- user
- session
- account
- verification

## App tables

### buildings
- id (text, pk)
- address
- normalized_address
- neighborhood
- lat
- lng
- management_company
- created_at
- updated_at

### listings
- id (text, pk)
- building_id (fk -> buildings.id)
- unit
- title
- description
- price
- beds
- baths
- sqft
- status (active, pending, archived)
- source (zillow, craigslist, etc.)
- source_id
- url
- posted_at
- last_seen_at
- saves_count (integer, default 0)
- created_at
- updated_at

Unique index: (source, source_id)

### listing_photos
- id (text, pk)
- listing_id (fk -> listings.id)
- url
- sort_order
- created_at

### listing_saves
- user_id (fk -> user.id)
- listing_id (fk -> listings.id)
- created_at

Unique index: (user_id, listing_id)

### public_records
- id (text, pk)
- building_id (fk -> buildings.id)
- record_type (inspection, violation, permit, ownership)
- source
- record_date
- status
- summary
- metadata_json
- created_at
