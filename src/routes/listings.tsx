import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import {
  getListings,
  getNeighborhoods,
  getViewer,
  Listing,
  Viewer,
} from '../data/mock-data'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/listings')({
  loader: async () => {
    const [listings, neighborhoods, viewer] = await Promise.all([
      getListings(),
      getNeighborhoods(),
      getViewer(),
    ])
    return { listings, neighborhoods, viewer }
  },
  component: ListingsPage,
})

const priceOptions = [
  { label: 'Any price', min: 0, max: 10000 },
  { label: 'Under $3k', min: 0, max: 3000 },
  { label: '$3k - $4k', min: 3000, max: 4000 },
  { label: '$4k+', min: 4000, max: 10000 },
]

const bedOptions = [
  { label: 'Any beds', value: 'any' },
  { label: 'Studio', value: '0' },
  { label: '1 bed', value: '1' },
  { label: '2+ beds', value: '2' },
]

function ListingsPage() {
  const { listings, neighborhoods, viewer } = Route.useLoaderData() as {
    listings: Listing[]
    neighborhoods: string[]
    viewer: Viewer
  }
  const { data: session } = authClient.useSession()
  const activeViewer = session?.user
    ? {
        ...viewer,
        id: session.user.id ?? viewer.id,
        name: session.user.name ?? viewer.name,
        email: session.user.email ?? viewer.email,
        avatar: session.user.image ?? viewer.avatar,
        isAuthenticated: true,
      }
    : viewer
  const [search, setSearch] = useState('')
  const [neighborhood, setNeighborhood] = useState('All SF')
  const [priceRange, setPriceRange] = useState(priceOptions[0]?.label ?? '')
  const [beds, setBeds] = useState(bedOptions[0]?.value ?? 'any')
  const [expandedListing, setExpandedListing] = useState<string | null>(null)

  const filteredListings = useMemo(() => {
    const price = priceOptions.find((option) => option.label === priceRange)

    return listings.filter((listing) => {
      const matchesSearch =
        listing.address.toLowerCase().includes(search.toLowerCase()) ||
        listing.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        listing.title.toLowerCase().includes(search.toLowerCase())
      const matchesNeighborhood =
        neighborhood === 'All SF' || listing.neighborhood === neighborhood
      const matchesPrice =
        !price || (listing.price >= price.min && listing.price <= price.max)
      const matchesBeds =
        beds === 'any' ||
        (beds === '2'
          ? listing.beds >= 2
          : listing.beds === Number(beds))

      return matchesSearch && matchesNeighborhood && matchesPrice && matchesBeds
    })
  }, [beds, listings, neighborhood, priceRange, search])

  const pageSize = 6
  const visibleListings = activeViewer.isAuthenticated
    ? filteredListings
    : filteredListings.slice(0, pageSize)
  const lockedCount = activeViewer.isAuthenticated
    ? 0
    : Math.max(filteredListings.length - pageSize, 0)

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-xl font-semibold text-[var(--ink)]">
            San Francisco rentals
          </h1>
          <span className="text-sm text-[var(--ink-muted)]">
            {filteredListings.length} results
          </span>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="sticky top-[65px] z-30 border-b border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
          <div className="relative flex-1 max-w-xs">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-faint)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search address..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 pl-10 pr-4 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition focus:border-[var(--ink-muted)]"
            />
          </div>
          <FilterPill
            value={neighborhood}
            options={neighborhoods}
            onChange={setNeighborhood}
          />
          <FilterPill
            value={priceRange}
            options={priceOptions.map((option) => option.label)}
            onChange={setPriceRange}
          />
          <FilterPill
            value={bedOptions.find((option) => option.value === beds)?.label ?? 'Any beds'}
            options={bedOptions.map((option) => option.label)}
            onChange={(label) => {
              const option = bedOptions.find((item) => item.label === label)
              setBeds(option?.value ?? 'any')
            }}
          />
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
          {/* Listings Grid */}
          <div className="grid gap-4 sm:grid-cols-2 items-start content-start">
            {visibleListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isExpanded={expandedListing === listing.id}
                onToggle={() =>
                  setExpandedListing(
                    expandedListing === listing.id ? null : listing.id
                  )
                }
              />
            ))}
            {lockedCount > 0 && !activeViewer.isAuthenticated && (
              <div className="col-span-full">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--ink-secondary)] transition hover:bg-[var(--border)]"
                >
                  Sign in to see {lockedCount} more listing{lockedCount > 1 ? 's' : ''}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Map Placeholder */}
          <aside className="hidden xl:block">
            <div className="sticky top-[140px] h-[calc(100vh-180px)] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--accent-soft)] flex flex-col items-center justify-center text-center p-8">
              <div className="rounded-full bg-[var(--surface-raised)] p-4 mb-4">
                <svg className="h-8 w-8 text-[var(--ink-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--ink)]">Map coming soon</p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                Explore neighborhoods visually
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Map Toggle */}
      <button className="fixed bottom-6 right-6 xl:hidden flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-[var(--ink-secondary)]">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Map
      </button>
    </div>
  )
}

function FilterPill({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--ink)] outline-none transition hover:border-[var(--border-strong)] focus:border-[var(--ink-muted)]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function DBIIndicator({ violations }: { violations: number }) {
  const status = violations === 0 ? 'good' : violations <= 1 ? 'warn' : 'bad'
  const colors = {
    good: 'bg-[var(--status-good)]',
    warn: 'bg-[var(--status-warn)]',
    bad: 'bg-[var(--status-bad)]',
  }
  const labels = {
    good: 'Clean record',
    warn: '1 open item',
    bad: `${violations} violations`,
  }

  return (
    <div className="group relative">
      <span className={`inline-block h-2 w-2 rounded-full ${colors[status]}`} />
      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition group-hover:opacity-100 pointer-events-none">
        <div className="whitespace-nowrap rounded-md bg-[var(--ink)] px-2 py-1 text-xs text-white">
          {labels[status]}
        </div>
      </div>
    </div>
  )
}

function ListingCard({
  listing,
  isExpanded,
  onToggle,
}: {
  listing: Listing
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-[var(--radius-lg)] border bg-[var(--surface-raised)] overflow-hidden transition-[border-color,box-shadow] duration-150 ${
        isExpanded
          ? 'border-[var(--border-strong)] shadow-[var(--shadow-md)]'
          : 'border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)]'
      }`}
    >
      {/* Photo */}
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={listing.photos[0]}
          alt={listing.address}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--ink-muted)]">
              {listing.neighborhood}
            </span>
            <DBIIndicator violations={listing.recordSummary.openViolations} />
          </div>
          <svg
            className={`h-4 w-4 text-[var(--ink-faint)] transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <p className="mt-1 font-medium text-[var(--ink)]">
          {listing.address}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-[var(--ink-muted)]">
            {listing.beds === 0 ? 'Studio' : `${listing.beds} bd`} · {listing.baths} ba
          </span>
          <span className="font-semibold text-[var(--ink)]">
            ${listing.price.toLocaleString()}/mo
          </span>
        </div>

        {/* Expanded Content - Simple show/hide for performance */}
        {isExpanded && (
          <div className="mt-4 border-t border-[var(--border)] pt-4 space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-wrap gap-2">
              {listing.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[var(--accent-soft)] px-2 py-1 text-xs text-[var(--ink-secondary)]"
                >
                  {tag}
                </span>
              ))}
              {listing.tags.length > 3 && (
                <span className="text-xs text-[var(--ink-muted)]">
                  +{listing.tags.length - 3} more
                </span>
              )}
            </div>
            <div className="text-sm text-[var(--ink-muted)]">
              {listing.sqft.toLocaleString()} sqft · {listing.photos.length} photos
            </div>
            <div className="rounded-[var(--radius-sm)] bg-[var(--accent-soft)] p-3 text-xs">
              <p className="font-medium text-[var(--ink)]">DBI Record</p>
              <p className="mt-1 text-[var(--ink-muted)]">
                {listing.recordSummary.note}
              </p>
              <p className="mt-1 text-[var(--ink-faint)]">
                Last inspection: {listing.recordSummary.lastInspection}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
              <span>Saved by {listing.savesCount} renters</span>
              <span>{listing.management}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
