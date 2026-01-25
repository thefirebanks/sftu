import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

import { mockListings } from '../../data/mock-data'

export const Route = createFileRoute('/api/listings')({
  server: {
    handlers: {
      GET: () => json(mockListings),
    },
  },
})
