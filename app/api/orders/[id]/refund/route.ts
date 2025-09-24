import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sb } from '@/lib/supabase-admin'

const key = process.env.STRIPE_SECRET_KEY
const stripe = key ? new Stripe(key, { apiVersion: '2023-10-16' }) : null as any

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
    const { amount }:{ amount: number|null } = await req.json()
    // Najdi payment intent podle metadata.order_id
    const search = await stripe.paymentIntents.search({ query: `metadata['order_id']:'${params.id}'` })
    const pi = search.data[0]
    if (!pi) return NextResponse.json({ error: 'Payment Intent not found' }, { status: 404 })

    const refund = await stripe.refunds.create({
      payment_intent: pi.id,
      amount: amount ? Math.round(amount * 100) : undefined
    })
    await sb.from('orders').update({ refund_id: refund.id }).eq('id', params.id)
    return NextResponse.json({ ok: true, refund })
  } catch (e:any) { return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 }) }
}
