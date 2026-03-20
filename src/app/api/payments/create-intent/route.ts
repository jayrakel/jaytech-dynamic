import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-02-15" as any });

export async function POST(req: NextRequest) {
  const { amount, currency = "usd", description, email, name } = await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency,
    metadata: { email, name, description },
    receipt_email: email,
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
