import { createFileRoute, Link } from '@tanstack/react-router'

import { getListings, getViewer, Listing, Viewer } from '../data/mock-data'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/profile')({
  loader: async () => {
    const [viewer, listings] = await Promise.all([
      getViewer(),
      getListings(),
    ])
    return { viewer, listings }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { viewer, listings } = Route.useLoaderData() as {
    viewer: Viewer
    listings: Listing[]
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

  const savedListings = listings.slice(0, 3)

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Profile Header */}
      <section className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={activeViewer.avatar}
                alt={activeViewer.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-semibold text-[var(--ink)]">
                  {activeViewer.name}
                </h1>
                <p className="text-sm text-[var(--ink-muted)]">
                  {activeViewer.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-[var(--ink-muted)]">
                  {activeViewer.plan} plan
                </p>
                <p className="text-xs text-[var(--ink-faint)]">
                  Since {activeViewer.memberSince}
                </p>
              </div>
              {activeViewer.isAuthenticated && (
                <button
                  onClick={() =>
                    authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          window.location.href = '/login'
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--ink-muted)] transition hover:bg-[var(--accent-soft)]"
                >
                  Sign out
                </button>
              )}
            </div>
          </div>

          {!activeViewer.isAuthenticated && (
            <div className="mt-6 flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--accent-soft)] p-4">
              <p className="text-sm text-[var(--ink-secondary)]">
                Sign in to unlock saves, notes, and alerts.
              </p>
              <Link
                to="/login"
                className="rounded-lg bg-[var(--ink)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--ink-secondary)]"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <p className="text-sm text-[var(--ink-muted)]">Home base</p>
              <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                {activeViewer.homeBase}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <p className="text-sm text-[var(--ink-muted)]">Saved listings</p>
              <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                {activeViewer.savedCount}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <p className="text-sm text-[var(--ink-muted)]">Active alerts</p>
              <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                3
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Saved Listings */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              Saved listings
            </h2>
            <Link
              to="/listings"
              className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition"
            >
              Browse more →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {savedListings.map((listing) => (
              <Link
                key={listing.id}
                to="/listings"
                className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] transition hover:border-[var(--border-strong)]"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={listing.photos[0]}
                    alt={listing.address}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-[var(--ink-muted)]">
                    {listing.neighborhood}
                  </p>
                  <p className="mt-1 font-medium text-[var(--ink)]">
                    {listing.address}
                  </p>
                  <p className="mt-2 font-semibold text-[var(--ink)]">
                    ${listing.price.toLocaleString()}/mo
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
