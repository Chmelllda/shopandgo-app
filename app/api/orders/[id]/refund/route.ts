// app/api/orders/[id]/refund/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../../../lib/stripe"; // <- relativní cesta

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const refund = await stripe.refunds.create({ payment_intent: params.id });
    return NextResponse.json(refund, { status: 200 });
  } catch (error: any) {
    console.error("Refund error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
