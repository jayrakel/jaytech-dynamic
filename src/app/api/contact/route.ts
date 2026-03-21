// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactNotification } from '@/lib/sendgrid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, service, budget, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    // Save to DB so it shows in Admin → Messages
    await prisma.message.create({
      data: { firstName, lastName, email, phone, service, budget, message },
    });

    // Send branded notification email — uses sendgrid.ts so the
    // "View in Dashboard" link uses appUrl() (runtime, never localhost)
    // and the email uses the master template with logo from settings.
    await sendContactNotification({ firstName, lastName, email, phone, service, budget, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}