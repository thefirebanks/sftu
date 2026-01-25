import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

import { authClient } from '../lib/auth-client'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Listings' },
  { to: '/profile', label: 'Profile' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  return (
    <header className="sticky top-0 z-40 bg-[var(--fog)]/90 backdrop-blur border-b border-black/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 p-2 text-[var(--plum)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-[var(--plum)]"
          >
            <span className="font-['Fraunces'] text-2xl">SFTU</span>
          </Link>
        </div>
        {!isAuthenticated && (
          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition hover:text-[var(--plum)]"
                activeProps={{ className: 'text-[var(--plum)]' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className="rounded-full border border-[var(--plum)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--plum)] transition hover:bg-[var(--plum)] hover:text-white"
          >
            {isAuthenticated ? 'Profile' : 'Sign In'}
          </Link>
        </div>
      </div>
      {isOpen && (
        <div className="border-t border-black/10 bg-white/90">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 text-sm font-medium text-[var(--muted)]">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="transition hover:text-[var(--plum)]"
                activeProps={{ className: 'text-[var(--plum)]' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[var(--plum)] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--plum)]"
            >
              {isAuthenticated ? 'Profile' : 'Sign In'}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
