import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth token is stored in localStorage (client-only), so middleware cannot access it.
// Route protection is handled by dashboard layout and AuthContext on the client.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
