import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { D1Dialect } from 'kysely-d1'
import { env } from 'cloudflare:workers'

export const authConfig: BetterAuthOptions = {
  appName: 'SFTU',
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.BETTER_AUTH_URL],
  database: {
    dialect: new D1Dialect({ database: env.DB }),
    type: 'sqlite',
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [tanstackStartCookies()],
}

export const auth = betterAuth(authConfig)
