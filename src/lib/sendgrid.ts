// src/lib/sendgrid.ts  — now powered by Resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = `Jay TechWave Solutions <onboarding@resend.dev>`;
const ADMIN  = process.env.ADMIN_EMAIL || 'jaytechwavesolutions@gmail.com';
const APP    = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Safely send — won't crash if RESEND_API_KEY is missing
async function send(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email skipped — no RESEND_API_KEY]', opts.subject);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, ...opts });
  } catch (e) {
    console.error('[Resend error]', e);
  }
}

// 1. New contact message → notify admin
export async function sendContactNotification(msg: {
  firstName: string; lastName: string; email: string;
  phone?: string; service?: string; budget?: string; message: string;
}) {
  await send({
    to: ADMIN,
    replyTo: msg.email,
    subject: `New enquiry from ${msg.firstName} ${msg.lastName}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${msg.firstName} ${msg.lastName}</p>
      <p><strong>Email:</strong> ${msg.email}</p>
      ${msg.phone   ? `<p><strong>Phone:</strong> ${msg.phone}</p>` : ''}
      ${msg.service ? `<p><strong>Service:</strong> ${msg.service}</p>` : ''}
      ${msg.budget  ? `<p><strong>Budget:</strong> ${msg.budget}</p>` : ''}
      <hr/>
      <p>${msg.message.replace(/\n/g, '<br/>')}</p>
    `,
  });
}

// 2. Admin reply → send to client
export async function sendReply(opts: {
  to: string; clientName: string; replyText: string; originalMessage: string;
}) {
  await send({
    to: opts.to,
    subject: 'Re: Your enquiry — Jay TechWave Solutions',
    html: `
      <p>Hi ${opts.clientName},</p>
      ${opts.replyText.replace(/\n/g, '<br/>')}
      <hr/>
      <p style="color:#888;font-size:12px"><em>Your original message:</em><br/>${opts.originalMessage.replace(/\n/g, '<br/>')}</p>
      <p style="color:#888;font-size:12px">Jay TechWave Solutions · Nairobi, Kenya</p>
    `,
  });
}

// 3. Newsletter subscribe confirmation
export async function sendSubscriptionConfirm(opts: {
  email: string; name?: string; token: string;
}) {
  const confirmUrl = `${APP}/api/subscribe/confirm?token=${opts.token}`;
  await send({
    to: opts.email,
    subject: 'Confirm your subscription — Jay TechWave Solutions',
    html: `
      <p>Hi ${opts.name || 'there'},</p>
      <p>Thanks for subscribing! Click below to confirm your email:</p>
      <p><a href="${confirmUrl}" style="background:#14B8A6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">Confirm Subscription</a></p>
      <p style="color:#888;font-size:12px">If you didn't subscribe, ignore this email.</p>
    `,
  });
}

// 4. Newsletter broadcast → all active subscribers
export async function sendNewsletter(opts: {
  subject: string; content: string;
  subscribers: { email: string; name?: string | null; token: string }[];
}) {
  for (const sub of opts.subscribers) {
    const unsubUrl = `${APP}/api/unsubscribe?token=${sub.token}`;
    await send({
      to: sub.email,
      subject: opts.subject,
      html: `
        ${opts.content}
        <hr/>
        <p style="color:#888;font-size:11px;text-align:center">
          Jay TechWave Solutions · Nairobi, Kenya<br/>
          <a href="${unsubUrl}" style="color:#888">Unsubscribe</a>
        </p>
      `,
    });
  }
}

// 5. New blog post → notify subscribers
export async function sendBlogNotification(opts: {
  postTitle: string; postSlug: string; postExcerpt: string;
  subscribers: { email: string; name?: string | null; token: string }[];
}) {
  const postUrl = `${APP}/blog/${opts.postSlug}`;
  for (const sub of opts.subscribers) {
    const unsubUrl = `${APP}/api/unsubscribe?token=${sub.token}`;
    await send({
      to: sub.email,
      subject: `New article: ${opts.postTitle}`,
      html: `
        <h2>${opts.postTitle}</h2>
        <p>${opts.postExcerpt}</p>
        <p><a href="${postUrl}" style="background:#14B8A6;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">Read Article →</a></p>
        <hr/>
        <p style="color:#888;font-size:11px;text-align:center">
          <a href="${unsubUrl}" style="color:#888">Unsubscribe</a>
        </p>
      `,
    });
  }
}