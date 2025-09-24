import { NextRequest, NextResponse } from 'next/server'
import { sb } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') || new Date().toISOString().slice(0,10)
  const to = searchParams.get('to') || from

  const fromISO = new Date(from + 'T00:00:00Z').toISOString()
  const toISO = new Date(to + 'T23:59:59Z').toISOString()

  const { data = [], error } = await sb.from('orders')
    .select('id, created_at, status, payment_status, total, address_text, courier_id')
    .gte('created_at', fromISO).lte('created_at', toISO).order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const header = ['id','created_at','status','payment_status','total','address_text','courier_id']
  const rows = data.map((o:any)=> header.map(h => (o[h] ?? '')).join(','))
  const csv = [header.join(','), ...rows].join('\n')

  return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="orders_${from}_${to}.csv"` } })
}
