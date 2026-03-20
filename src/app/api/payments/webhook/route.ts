import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-02-15" as any });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    await prisma.payment.upsert({
      where:  { stripeId: pi.id },
      update: { status: "COMPLETED" },
      create: {
        stripeId:    pi.id,
        amount:      pi.amount / 100,
        currency:    pi.currency,
        description: pi.metadata.description,
        email:       pi.metadata.email || "",
        name:        pi.metadata.name  || "",
        status:      "COMPLETED",
        metadata:    pi.metadata as any,
      },
    });
  }

  return NextResponse.json({ received: true });
}
