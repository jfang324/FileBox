import { handleAuth } from '@auth0/nextjs-auth0'

// Dynamic route for auth0 related routes
export const GET = handleAuth()
