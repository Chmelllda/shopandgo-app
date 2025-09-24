import { NextRequest, NextResponse } from 'next/server'
import { sb } from '@/lib/supabase-admin'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const patch: any = {}
    if (typeof body.lat === 'number' && typeof body.lng === 'number') patch.courier_geo = { lat: body.lat, lng: body.lng }
    if (typeof body.status === 'string') patch.status = body.status
    if (typeof body.eta_minutes === 'number') patch.eta_minutes = body.eta_minutes
    const { error } = await sb.from('orders').update(patch).eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 }) }
}
