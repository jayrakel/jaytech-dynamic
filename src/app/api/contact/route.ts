import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. Grab the data the user typed into your frontend form
    const body = await req.json();
    const { name, email, subject, message } = body;

    // 2. Send the email using Resend
    const data = await resend.emails.send({
      from: 'Jay TechWave Website <onboarding@resend.dev>', 
      to: ['your-actual-email@gmail.com'], // <-- CHANGE THIS to the email where you want to receive messages
      reply_to: email, // This lets you hit "Reply" in Gmail and it goes directly to the client
      subject: subject || `New Website Lead from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // 3. Tell the frontend it was successful
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json(
      { error: 'Failed to send message.' }, 
      { status: 500 }
    );
  }
}