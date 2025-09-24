import { NextRequest, NextResponse } from 'next/server'
import { sb } from '@/lib/supabase-admin'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { courier_id } = await req.json()
    if (!courier_id) return NextResponse.json({ error: 'courier_id required' }, { status: 400 })
    const { error } = await sb.from('orders').update({ courier_id }).eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 }) }
}
