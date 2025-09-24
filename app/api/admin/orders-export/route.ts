import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY as string; // zajistí že je to string
const stripe = new Stripe(key, { apiVersion: "2022-11-15" });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // refund vytvoříme podle PaymentIntentu
    const refund = await stripe.refunds.create({
      payment_intent: id,
    });

    return NextResponse.json(refund, { status: 200 });
  } catch (error: any) {
    console.error("Refund error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
