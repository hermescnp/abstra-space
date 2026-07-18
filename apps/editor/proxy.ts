import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const destination = request.nextUrl.clone()
  destination.pathname = '/studio'
  return NextResponse.redirect(destination)
}

export const config = {
  matcher: '/',
}
