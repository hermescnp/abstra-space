import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@hermescnp/auth/handlers'

export async function proxy(request: NextRequest) {
  // Next only loads env from apps/editor/.env* for this runtime.
  // Skip session refresh when Supabase isn't configured yet.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.next()
  }
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Refresh Supabase session cookies on page navigations.
     * Skip static assets and Next internals.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
