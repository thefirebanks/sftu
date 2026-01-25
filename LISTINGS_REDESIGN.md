# Listings Page Redesign Plan

## Design Philosophy

The current listings page tries to show everything at once. Great product design is about **what you choose to hide**, not what you show. We'll take inspiration from:

- **Airbnb**: Photo-forward cards, progressive disclosure, clean filters
- **Linear**: Restrained color, excellent typography hierarchy, dense but scannable
- **Stripe**: Generous whitespace, subtle shadows, refined interactions
- **Apple**: Confidence in simplicity, every pixel intentional

**Core principle**: Make the apartment photos and prices the heroes. Everything else supports those two things.

---

## Current Problems (Detailed)

### 1. Listing Cards Are Doing Too Much
Each card currently displays:
- Photo (small, 180px)
- Title + neighborhood badge
- Address
- 4+ tags + photo count
- Beds / Baths / Sqft
- Price + "per month"
- "Saved by X renters"
- "Managed by X"
- DBI summary box (3 lines of text)

**That's 12+ distinct pieces of information per card.** Users can't scan. They have to read.

### 2. Visual Noise Everywhere
- Tags use uppercase tracking (creates tension)
- DBI box has its own background color (competes with photo)
- Neighborhood badge is bright teal (pulls focus from price)
- Multiple font sizes fighting for attention

### 3. No Clear Visual Hierarchy
Everything feels equally important. When everything is important, nothing is.

### 4. The Map Feels Like an Afterthought
- Placeholder gradients with floating price markers
- Disconnected from the listings visually
- "Preview mode" label is confusing

### 5. Filter Bar Is Heavy
- Labels above each input add visual weight
- Uppercase tracking on every label
- Takes up significant vertical space

---

## The Redesign

### Design Tokens (Updated)

```css
/* Colors - Simplified */
--ink: #18181b;        /* zinc-900 - primary text */
--ink-muted: #71717a;  /* zinc-500 - secondary text */
--ink-faint: #a1a1aa;  /* zinc-400 - tertiary/disabled */
--surface: #fafafa;    /* zinc-50 - page background */
--card: #ffffff;       /* white - card background */
--border: #e4e4e7;     /* zinc-200 - borders */
--accent: #18181b;     /* ink - buttons, key actions */
--accent-soft: #f4f4f5; /* zinc-100 - hover states, subtle backgrounds */

/* We remove: --sea, --sky, --sun, --plum, --sand, --fog */
/* One accent color. Monochromatic with warmth from photos. */

/* Spacing scale */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;

/* Border radius - just two */
--radius-md: 12px;
--radius-lg: 16px;

/* Shadows - subtle, layered */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.06);
--shadow-lg: 0 12px 32px rgba(0,0,0,0.08);
```

---

### Component 1: Page Header

**Before**: Title + subtitle + floating "Today in SF" stats card

**After**: Minimal, confident header

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  San Francisco rentals                              7 results   │
│  ─────────────────────                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Changes**:
- Remove "Listings map" label
- Remove subtitle paragraph
- Remove the stats card entirely
- Simple: "San Francisco rentals" (h1) + result count on the right
- No uppercase tracking
- Just the essential information

---

### Component 2: Filter Bar

**Before**: Stacked labels + inputs, uppercase tracking, heavy visual weight

**After**: Inline, minimal, pill-style filters

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────┐  ┌─────────┐ ┌───────┐ ┌───────┐  │
│  │ 🔍 Search address...     │  │ All SF ▾│ │ Price▾│ │ Beds ▾│  │
│  └──────────────────────────┘  └─────────┘ └───────┘ └───────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Changes**:
- Remove labels above inputs (placeholder text is sufficient)
- Smaller, tighter filter pills
- Remove uppercase tracking
- Single row, always
- Subtle border, no shadow
- Active filters get a subtle background tint

---

### Component 3: Listing Cards (The Big One)

**Before**: Horizontal card with small photo, 12+ data points, DBI box

**After**: Photo-forward vertical card, progressive disclosure

**Layout Option A - Grid of vertical cards** (Airbnb-style):

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│                 │  │                 │  │                 │
│     [PHOTO]     │  │     [PHOTO]     │  │     [PHOTO]     │
│     280px       │  │                 │  │                 │
│                 │  │                 │  │                 │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ Mission         │  │ SoMa            │  │ Noe Valley      │
│ 2595 Harrison   │  │ 151 Townsend    │  │ 22 24th St      │
│                 │  │                 │  │                 │
│ 2 bd · 1 ba     │  │ 1 bd · 1 ba     │  │ 2 bd · 2 ba     │
│ $3,890/mo       │  │ $4,250/mo       │  │ $4,650/mo       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Layout Option B - Compact list** (Linear-style, better for power users):

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌────┐                                                          │
│ │img │  2595 Harrison St · Mission           2bd 1ba   $3,890   │
│ └────┘  Warm Mission Flat with Patio            ●───────────────│
└─────────────────────────────────────────────────────────────────┘
```

**I recommend Option A** for this product. Apartment hunting is emotional - photos matter.

**Card Information Hierarchy** (in order of importance):
1. **Photo** - Large, 16:10 aspect ratio, fills card width
2. **Neighborhood** - Small, muted text above address
3. **Address** - Primary identifier
4. **Beds · Baths** - Essential specs, inline
5. **Price** - Bold, right-aligned or below specs

**What we REMOVE from the card**:
- ❌ Title ("Glassline Loft with Skyline View") - addresses are more useful
- ❌ Tags (roof deck, in-unit laundry, gym) - move to detail view
- ❌ Photo count badge - unnecessary
- ❌ Sqft - move to detail view
- ❌ "Saved by X renters" - move to detail view
- ❌ "Managed by X" - move to detail view
- ❌ DBI summary box - becomes a small icon/indicator

**DBI Indicator** (replaces the box):
- Small dot or icon next to address
- Green dot = clean record
- Yellow dot = minor issues
- Red dot = violations
- Hover/click reveals tooltip with summary

---

### Component 4: Map Sidebar

**Before**: Gradient placeholder with floating price pills

**After**: Clean, functional map placeholder (until real map integration)

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│           [ Map placeholder ]           │
│                                         │
│      "Map coming soon. For now,         │
│       browse the list view."            │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Or, remove it entirely** until we have a real map. The current placeholder adds visual noise without value.

**Recommendation**: Hide the map sidebar for now. Use full width for the card grid. Add map back when it's functional.

---

### Component 5: Locked Listings CTA

**Before**: Dotted border box with multiple text lines and two buttons

**After**: Subtle inline prompt

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Sign in to see 3 more listings  →                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Changes**:
- Single line of text
- Subtle background (not a "card")
- No dotted border
- Arrow indicates action
- Feels like a gentle nudge, not a wall

---

## Implementation Order

### Phase 1: Foundation (Do First)
1. Update CSS variables to new design tokens
2. Remove the map sidebar (full-width listings)
3. Simplify the page header

### Phase 2: Listing Cards
4. Rebuild ListingCard component with new layout
5. Implement DBI indicator (dot system)
6. Set up responsive grid (3 columns → 2 → 1)

### Phase 3: Filters & Polish
7. Redesign filter bar
8. Update locked listings CTA
9. Add hover states and transitions
10. Fine-tune spacing and typography

---

## Visual Reference (ASCII Mockup)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ☰  SFTU                    Home    Listings    Profile       Sign In   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│    San Francisco rentals                                    7 results   │
│                                                                         │
│    ┌─────────────────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│    │ 🔍 Search...        │ │ All SF▾│ │ Price ▾│ │ Beds  ▾│            │
│    └─────────────────────┘ └────────┘ └────────┘ └────────┘            │
│                                                                         │
│    ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐      │
│    │                  │ │                  │ │                  │      │
│    │                  │ │                  │ │                  │      │
│    │      PHOTO       │ │      PHOTO       │ │      PHOTO       │      │
│    │                  │ │                  │ │                  │      │
│    │                  │ │                  │ │                  │      │
│    ├──────────────────┤ ├──────────────────┤ ├──────────────────┤      │
│    │ Mission       ●  │ │ SoMa          ●  │ │ Noe Valley    ●  │      │
│    │ 2595 Harrison St │ │ 151 Townsend St  │ │ 22 24th St       │      │
│    │ 2 bd · 1 ba      │ │ 1 bd · 1 ba      │ │ 2 bd · 2 ba      │      │
│    │ $3,890/mo        │ │ $4,250/mo        │ │ $4,650/mo        │      │
│    └──────────────────┘ └──────────────────┘ └──────────────────┘      │
│                                                                         │
│    ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐      │
│    │                  │ │                  │ │                  │      │
│    │      PHOTO       │ │      PHOTO       │ │      PHOTO       │      │
│    │                  │ │                  │ │                  │      │
│    ├──────────────────┤ ├──────────────────┤ ├──────────────────┤      │
│    │ Inner Richmond ● │ │ Haight        ●  │ │ North Beach   ●  │      │
│    │ 744 7th Ave      │ │ 931 Ashbury St   │ │ 1200 Columbus    │      │
│    │ 1 bd · 1 ba      │ │ Studio · 1 ba    │ │ 2 bd · 1 ba      │      │
│    │ $3,380/mo        │ │ $2,790/mo        │ │ $4,525/mo        │      │
│    └──────────────────┘ └──────────────────┘ └──────────────────┘      │
│                                                                         │
│    ┌─────────────────────────────────────────────────────────────┐     │
│    │  Sign in to see 1 more listing  →                           │     │
│    └─────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Success Metrics

After implementation, the page should feel:
- **Scannable** - Users can evaluate 6 listings in under 10 seconds
- **Calm** - No element screams for attention
- **Photo-forward** - Apartments sell themselves through imagery
- **Fast** - Perceived performance through clean layout
- **Trustworthy** - Professional, refined, not cluttered

---

## Map Integration Strategy

### Decision: Responsive Split View (Option E)

**Desktop (1280px+)**: Side-by-side layout
```
┌────────────────────────────────────┬────────────────────────┐
│                                    │                        │
│   Listings (2-col grid)            │         MAP            │
│   ~60% width                       │       ~40% width       │
│   scrollable                       │       sticky           │
│                                    │                        │
└────────────────────────────────────┴────────────────────────┘
```

**Tablet & Mobile (<1280px)**: Full-width list + floating map toggle
```
┌─────────────────────────────────────────────────┐
│   Listings (full width, 2-col → 1-col)          │
│                                                 │
│                               ┌───────────────┐ │
│                               │ 🗺 Map        │ │
│                               └───────────────┘ │
└─────────────────────────────────────────────────┘

        ↓ tap "Map" button ↓

┌─────────────────────────────────────────────────┐
│                    MAP (full)                   │
│                                                 │
│   $3.9k ●              $4.2k ●                  │
│                  $4.6k ●                        │
│                               ┌───────────────┐ │
│                               │ 📋 List       │ │
│                               └───────────────┘ │
└─────────────────────────────────────────────────┘
```

### Map-List Interactions

1. **Hover on listing card** → Highlight corresponding map pin (scale up, change color)
2. **Hover on map pin** → Highlight corresponding card (subtle border/shadow)
3. **Click map pin** → Scroll list to that card + expand preview
4. **Pan/zoom map** → Filter listings to visible bounds (optional, can be toggled)

### Map Placeholder (Phase 1)

Until Google Maps is integrated, show a clean placeholder:
```
┌────────────────────────────────────┐
│                                    │
│          ┌──────────────┐          │
│          │   🗺          │          │
│          └──────────────┘          │
│                                    │
│      Map integration coming        │
│      Pin locations are ready       │
│                                    │
│   ┌──────────────────────────┐     │
│   │ Notify me when it's live │     │
│   └──────────────────────────┘     │
│                                    │
└────────────────────────────────────┘
```

- Solid light background (no gradient noise)
- Clear messaging
- Optional email capture for launch notification
- Still shows the layout/space the map will occupy

### Implementation Notes

- Use CSS Grid for the split: `grid-template-columns: 1fr 400px`
- Map container: `position: sticky; top: 80px; height: calc(100vh - 100px)`
- Breakpoint at 1280px for split → stacked
- Floating button: `position: fixed; bottom: 24px; right: 24px`
- Map pins will use lat/lng from listing data (already have `map.x` and `map.y`)

---

## Revised Implementation Order

### Phase 1: Layout Foundation
1. Update CSS variables (new design tokens)
2. Restructure page layout (split view grid)
3. Create map placeholder component
4. Simplify page header

### Phase 2: Listing Cards
5. Rebuild ListingCard with photo-forward layout
6. Implement DBI indicator dots
7. Set up responsive card grid (2-col in list area)

### Phase 3: Filters & Interactions
8. Redesign filter bar (inline pills)
9. Add card hover states
10. Wire up map-list hover interactions (prep for real map)

### Phase 4: Mobile & Polish
11. Implement floating map toggle for mobile
12. Add transitions and micro-interactions
13. Update locked listings CTA
14. Fine-tune responsive breakpoints

### Phase 5: Google Maps Integration (Future)
15. Replace placeholder with Google Maps
16. Render listing pins with prices
17. Implement click/hover interactions
18. Add "search this area" functionality

---

## Open Questions

1. **DBI indicator** - Always visible as a dot, or show on hover?
2. **Card click behavior** - Navigate to detail page, or expand inline?
3. **Map placeholder** - Include email capture, or just informational?

---

Ready to implement when you are.
