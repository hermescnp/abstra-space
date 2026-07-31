'use client'

/**
 * Client-safe re-exports from `@hermescnp/auth/client`.
 * Avoid the package barrel — it also exports server handlers that pull
 * `next/server` into the client graph (breaks Next 16 Turbopack).
 */
export { AuthProvider, useAuth } from '@hermescnp/auth/client'
