import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_BASIC_USER
  const pass = process.env.ADMIN_BASIC_PASS
  if (!user || !pass) return NextResponse.next()

  const header = req.headers.get('authorization') || ''
  if (header.startsWith('Basic ')) {
    const creds = Buffer.from(header.split(' ')[1], 'base64').toString('utf8')
    const [u, p] = creds.split(':')
    if (u === user && p === pass) return NextResponse.next()
  }
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm=\"admin\"' }
  })
}
