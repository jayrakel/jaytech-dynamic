// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, service, budget, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    // Save to DB so it shows up in Admin → Messages
    await prisma.message.create({
      data: { firstName, lastName, email, phone, service, budget, message },
    });

    // Send email notification to you
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Jay TechWave Website <onboarding@resend.dev>',
        to: ['jaytechwavesolutions@gmail.com'],
        replyTo: email,
        subject: `New enquiry from ${firstName} ${lastName}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone   ? `<p><strong>Phone:</strong> ${phone}</p>`     : ''}
          ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
          ${budget  ? `<p><strong>Budget:</strong> ${budget}</p>`   : ''}
          <hr/>
          <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}