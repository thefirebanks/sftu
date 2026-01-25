import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { getViewer, Viewer } from '../data/mock-data'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/login')({
  loader: async () => {
    const viewer = await getViewer()
    if (viewer.isAuthenticated) {
      throw redirect({ to: '/profile' })
    }
    return viewer
  },
  component: LoginPage,
})

function LoginPage() {
  const viewer = Route.useLoaderData() as Viewer
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

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/profile',
    })
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
      <section className="mx-auto max-w-md w-full px-6 py-16">
        {activeViewer.isAuthenticated ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[var(--ink)]">
              Welcome back, {activeViewer.name.split(' ')[0]}
            </h1>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Head to your profile to continue your search.
            </p>
            <Link
              to="/profile"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--ink-secondary)]"
            >
              Go to profile
            </Link>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-[var(--ink)]">
                Sign in to SFTU
              </h1>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Save listings, set alerts, and browse unlimited results.
              </p>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <button
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--accent-soft)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--ink-muted)] text-center">
                  New to SFTU? Sign in to create your account automatically.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[var(--radius-md)] bg-[var(--accent-soft)] p-4">
              <p className="text-sm font-medium text-[var(--ink)]">What you get</p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--ink-muted)]">
                <li>• Unlimited browsing beyond the first page</li>
                <li>• Save listings and track buildings</li>
                <li>• Price drop and permit alerts</li>
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
