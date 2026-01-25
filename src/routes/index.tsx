import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import {
  getFeaturedListings,
  getNeighborhoods,
  getViewer,
} from '../data/mock-data'

export const Route = createFileRoute('/')({
  loader: async () => {
    const viewer = await getViewer()
    if (viewer.isAuthenticated) {
      throw redirect({ to: '/listings' })
    }
    const [featured, neighborhoods] = await Promise.all([
      getFeaturedListings(),
      getNeighborhoods(),
    ])
    return { featured, neighborhoods }
  },
  component: App,
})

function App() {
  const { featured, neighborhoods } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Hero Section */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-5xl">
              San Francisco rentals,
              <br />
              <span className="text-[var(--ink-muted)]">with building context.</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--ink-muted)] leading-relaxed">
              We combine Zillow, Craigslist, and public DBI records so you can
              compare listings alongside inspection history, permits, and violations.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/listings"
                className="rounded-lg bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--ink-secondary)]"
              >
                Browse listings
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--accent-soft)]"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Listings Preview */}
      <section className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-[var(--ink-muted)]">
              Recently added
            </h2>
            <Link
              to="/listings"
              className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((listing) => (
              <Link
                key={listing.id}
                to="/listings"
                className="group rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--border-strong)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--ink-muted)]">
                    {listing.neighborhood}
                  </span>
                  <span className="font-medium text-[var(--ink)]">
                    ${listing.price.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--ink)]">
                  {listing.address}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            How it works
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Deduplicated listings',
                detail:
                  'We collapse duplicates across Zillow and Craigslist so you only see unique units.',
              },
              {
                title: 'Building records attached',
                detail:
                  'Every listing shows DBI inspections, permits, and violations for that address.',
              },
              {
                title: 'Map-first exploration',
                detail:
                  'Browse by neighborhood, then drill into specific blocks to find your spot.',
              },
            ].map((feature) => (
              <div key={feature.title}>
                <h3 className="font-medium text-[var(--ink)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">
                  {feature.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              Neighborhoods
            </h2>
            <Link
              to="/listings"
              className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition"
            >
              See map →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((neighborhood) => (
              <Link
                key={neighborhood}
                to="/listings"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--ink)] transition hover:border-[var(--border-strong)]"
              >
                {neighborhood}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
