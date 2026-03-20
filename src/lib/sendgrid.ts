// src/lib/sendgrid.ts  — now powered by Resend
import { Resend } from 'resend';
import { getSettings } from '@/lib/settings'; // Import our settings fetcher

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = `Jay TechWave Solutions <onboarding@resend.dev>`;
const ADMIN  = process.env.ADMIN_EMAIL || 'jaytechwavesolutions@gmail.com';
const APP    = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// 🎨 MASTER EMAIL TEMPLATE 
async function buildEmail(content: string, footerExtras: string = '') {
  // 1. Fetch the live settings from the database to get the logo URL
  const settings = await getSettings().catch(() => ({}));
  const logoUrl = settings.logo_url || '';

  // 2. Build the Header Logo (Full Color)
  const headerBrand = logoUrl 
    ? `<img src="${logoUrl}" alt="Jay TechWave Solutions" style="height:45px; width:auto; display:block; margin:0 auto;" />`
    : `<h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;font-weight:900;">Jay TechWave<span style="color:#14B8A6;">.</span></h1>`;

  // 3. Build the Footer Logo (Sleek Grayscale & Faded)
  const footerBrand = logoUrl
    ? `<img src="${logoUrl}" alt="Jay TechWave" style="height:24px; width:auto; display:block; margin:0 auto 15px auto; opacity:0.6; filter:grayscale(100%);" />`
    : ``;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:40px 10px;">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
            
            <tr>
              <td style="background-color:#020617;padding:35px 30px;text-align:center;">
                ${headerBrand}
              </td>
            </tr>

            <tr>
              <td style="padding:40px 30px;color:#334155;font-size:16px;line-height:1.7;">
                ${content}
              </td>
            </tr>

            <tr>
              <td style="background-color:#f8fafc;padding:30px;text-align:center;border-top:1px solid #e2e8f0;">
                ${footerBrand}
                <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">
                  &copy; ${new Date().getFullYear()} ${settings.site_name || 'Jay TechWave Solutions'}.<br/>
                  Nairobi, Kenya
                </p>
                ${footerExtras}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

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
  const content = `
    <h2 style="color:#0f172a;margin-top:0;">New Website Enquiry</h2>
    <table width="100%" style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:20px;">
      <tr><td style="padding-bottom:10px;"><strong>Name:</strong> ${msg.firstName} ${msg.lastName}</td></tr>
      <tr><td style="padding-bottom:10px;"><strong>Email:</strong> <a href="mailto:${msg.email}" style="color:#14B8A6;">${msg.email}</a></td></tr>
      ${msg.phone   ? `<tr><td style="padding-bottom:10px;"><strong>Phone:</strong> ${msg.phone}</td></tr>` : ''}
      ${msg.service ? `<tr><td style="padding-bottom:10px;"><strong>Service:</strong> ${msg.service}</td></tr>` : ''}
      ${msg.budget  ? `<tr><td style="padding-bottom:10px;"><strong>Budget:</strong> ${msg.budget}</td></tr>` : ''}
    </table>
    <h3 style="color:#0f172a;font-size:16px;">Message:</h3>
    <p style="background:#f1f5f9;padding:15px;border-left:4px solid #14B8A6;border-radius:4px;white-space:pre-wrap;">${msg.message}</p>
  `;
  await send({
    to: ADMIN,
    replyTo: msg.email,
    subject: `New enquiry from ${msg.firstName} ${msg.lastName}`,
    html: await buildEmail(content),
  });
}

// 2. Admin reply → send to client
export async function sendReply(opts: {
  to: string; clientName: string; replyText: string; originalMessage: string;
}) {
  const content = `
    <p>Hi ${opts.clientName},</p>
    <div style="white-space:pre-wrap;">${opts.replyText}</div>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0;"/>
    <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Your original message:</p>
    <p style="color:#64748b;font-size:13px;font-style:italic;background:#f8fafc;padding:15px;border-radius:8px;white-space:pre-wrap;">${opts.originalMessage}</p>
  `;
  await send({
    to: opts.to,
    subject: 'Re: Your enquiry — Jay TechWave Solutions',
    html: await buildEmail(content),
  });
}

// 3. Newsletter subscribe confirmation
export async function sendSubscriptionConfirm(opts: {
  email: string; name?: string; token: string;
}) {
  const confirmUrl = `${APP}/api/subscribe/confirm?token=${opts.token}`;
  const content = `
    <h2 style="color:#0f172a;margin-top:0;text-align:center;">Welcome aboard!</h2>
    <p style="text-align:center;">Hi ${opts.name || 'there'}, thanks for subscribing to Jay TechWave Updates.</p>
    <p style="text-align:center;">Please click the button below to confirm your email address and activate your subscription.</p>
    <div style="text-align:center;margin:35px 0;">
      <a href="${confirmUrl}" style="background-color:#14B8A6;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Confirm Subscription</a>
    </div>
    <p style="color:#94a3b8;font-size:12px;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
  `;
  await send({
    to: opts.email,
    subject: 'Confirm your subscription — Jay TechWave Solutions',
    html: await buildEmail(content),
  });
}

// 4. Newsletter broadcast → all active subscribers
export async function sendNewsletter(opts: {
  subject: string; content: string;
  subscribers: { email: string; name?: string | null; token: string }[];
}) {
  for (const sub of opts.subscribers) {
    const unsubUrl = `${APP}/api/unsubscribe?token=${sub.token}`;
    const firstName = sub.name ? sub.name.split(' ')[0] : 'there';
    
    const personalizedContent = opts.content.replace(/\{\{name\}\}/gi, firstName);
    const personalizedSubject = opts.subject.replace(/\{\{name\}\}/gi, firstName);

    const content = `
      <div style="white-space:pre-wrap;">
        ${personalizedContent}
      </div>
    `;

    const footerExtras = `<p style="margin:15px 0 0;"><a href="${unsubUrl}" style="color:#94a3b8;font-size:11px;text-decoration:underline;">Unsubscribe from these emails</a></p>`;

    await send({
      to: sub.email,
      subject: personalizedSubject,
      html: await buildEmail(content, footerExtras),
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
    const content = `
      <p style="color:#14B8A6;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">New Article</p>
      <h2 style="color:#0f172a;margin-top:0;font-size:22px;line-height:1.3;">${opts.postTitle}</h2>
      <p style="color:#475569;font-size:16px;">${opts.postExcerpt}</p>
      <div style="margin:30px 0 10px;">
        <a href="${postUrl}" style="background-color:#0f172a;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Read Full Article →</a>
      </div>
    `;

    const footerExtras = `<p style="margin:15px 0 0;"><a href="${unsubUrl}" style="color:#94a3b8;font-size:11px;text-decoration:underline;">Unsubscribe</a></p>`;

    await send({
      to: sub.email,
      subject: `New article: ${opts.postTitle}`,
      html: await buildEmail(content, footerExtras),
    });
  }
}