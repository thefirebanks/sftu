import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export type Listing = {
  id: string
  title: string
  address: string
  neighborhood: string
  price: number
  beds: number
  baths: number
  sqft: number
  photos: string[]
  tags: string[]
  management: string
  savesCount: number
  recordSummary: {
    openViolations: number
    lastInspection: string
    note: string
  }
  map: {
    x: string
    y: string
  }
}

export type Viewer = {
  id: string
  name: string
  email: string
  plan: string
  savedCount: number
  homeBase: string
  memberSince: string
  avatar: string
  isAuthenticated: boolean
}

export const mockListings: Listing[] = [
  {
    id: 'soma-slate-01',
    title: 'Glassline Loft with Skyline View',
    address: '151 Townsend St, Unit 610',
    neighborhood: 'SoMa',
    price: 4250,
    beds: 1,
    baths: 1,
    sqft: 720,
    photos: [
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['roof deck', 'in-unit laundry', 'gym'],
    management: 'Coastal Urban Partners',
    savesCount: 28,
    recordSummary: {
      openViolations: 1,
      lastInspection: '2024-12-18',
      note: 'Minor elevator service notice resolved within 30 days.',
    },
    map: { x: '38%', y: '42%' },
  },
  {
    id: 'mission-olive-02',
    title: 'Warm Mission Flat with Patio',
    address: '2595 Harrison St, Apt 3',
    neighborhood: 'Mission',
    price: 3890,
    beds: 2,
    baths: 1,
    sqft: 890,
    photos: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501876725168-00c445821c9e?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['private patio', 'pet friendly', 'updated kitchen'],
    management: 'Harrison Lane Living',
    savesCount: 41,
    recordSummary: {
      openViolations: 0,
      lastInspection: '2025-01-05',
      note: 'Clean inspection record with recent fire safety update.',
    },
    map: { x: '46%', y: '55%' },
  },
  {
    id: 'noe-terrace-03',
    title: 'Noe Valley Terrace Retreat',
    address: '22 24th St, Unit B',
    neighborhood: 'Noe Valley',
    price: 4650,
    beds: 2,
    baths: 2,
    sqft: 1080,
    photos: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['garden view', 'fireplace', 'garage spot'],
    management: 'Valley & Co.',
    savesCount: 19,
    recordSummary: {
      openViolations: 2,
      lastInspection: '2024-11-29',
      note: 'Two open plumbing items scheduled for repair.',
    },
    map: { x: '40%', y: '66%' },
  },
  {
    id: 'richmond-bay-04',
    title: 'Richmond Rowhouse with Bay Light',
    address: '744 7th Ave, Apt 2',
    neighborhood: 'Inner Richmond',
    price: 3380,
    beds: 1,
    baths: 1,
    sqft: 640,
    photos: [
      'https://images.unsplash.com/photo-1501876725168-00c445821c9e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['quiet street', 'bike storage', 'updated bath'],
    management: 'Pacific West Homes',
    savesCount: 12,
    recordSummary: {
      openViolations: 0,
      lastInspection: '2024-10-22',
      note: 'No open DBI items in the last 24 months.',
    },
    map: { x: '24%', y: '48%' },
  },
  {
    id: 'haight-violet-05',
    title: 'Haight Studio with Sunroom',
    address: '931 Ashbury St, Studio 5',
    neighborhood: 'Haight',
    price: 2790,
    beds: 0,
    baths: 1,
    sqft: 480,
    photos: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['sunroom', 'walkable', 'historic'],
    management: 'Ashbury Collective',
    savesCount: 9,
    recordSummary: {
      openViolations: 1,
      lastInspection: '2024-09-11',
      note: 'Roof maintenance scheduled for Q2 2025.',
    },
    map: { x: '33%', y: '58%' },
  },
  {
    id: 'north-beach-amber-06',
    title: 'North Beach Corner with Harbor Air',
    address: '1200 Columbus Ave, Unit 12',
    neighborhood: 'North Beach',
    price: 4525,
    beds: 2,
    baths: 1,
    sqft: 920,
    photos: [
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['corner unit', 'water view', 'storage'],
    management: 'Harborline Property Group',
    savesCount: 31,
    recordSummary: {
      openViolations: 0,
      lastInspection: '2025-01-14',
      note: 'Recently passed seismic safety review.',
    },
    map: { x: '55%', y: '34%' },
  },
  {
    id: 'sunset-lagoon-07',
    title: 'Sunset Bungalow Near Ocean',
    address: '1820 Judah St, Unit 1',
    neighborhood: 'Outer Sunset',
    price: 3180,
    beds: 1,
    baths: 1,
    sqft: 710,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['ocean air', 'hardwood', 'laundry on-site'],
    management: 'Sunset Shore Rentals',
    savesCount: 17,
    recordSummary: {
      openViolations: 3,
      lastInspection: '2024-08-19',
      note: 'Active facade repairs with expected completion in 60 days.',
    },
    map: { x: '15%', y: '70%' },
  },
]

export const mockViewer: Viewer = {
  id: 'viewer-1',
  name: 'Maya Chen',
  email: 'maya@sftu.app',
  plan: 'Explorer',
  savedCount: 14,
  homeBase: 'Potrero Hill',
  memberSince: '2024-11-01',
  avatar:
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
  isAuthenticated: false,
}

export const mockNeighborhoods = [
  'All SF',
  'SoMa',
  'Mission',
  'Noe Valley',
  'Inner Richmond',
  'Haight',
  'North Beach',
  'Outer Sunset',
]

export const getListings = createServerFn({
  method: 'GET',
}).handler(async () => mockListings)

export const getFeaturedListings = createServerFn({
  method: 'GET',
}).handler(async () => mockListings.slice(0, 3))

export const getNeighborhoods = createServerFn({
  method: 'GET',
}).handler(async () => mockNeighborhoods)

export const getViewer = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const headers = getRequestHeaders()
    const { auth } = await import('../lib/auth')
    const session = await auth.api.getSession({ headers })
    const user = session?.user

    if (!user) {
      return mockViewer
    }

    const memberSince = user.createdAt
      ? new Date(user.createdAt).toISOString().split('T')[0]
      : mockViewer.memberSince

    return {
      ...mockViewer,
      id: user.id ?? mockViewer.id,
      name: user.name ?? mockViewer.name,
      email: user.email ?? mockViewer.email,
      avatar: user.image ?? mockViewer.avatar,
      memberSince,
      isAuthenticated: true,
    }
  } catch {
    return mockViewer
  }
})
