# Jay TechWave Solutions — Dynamic Website

A fully dynamic Next.js 14 website with admin dashboard, database, emails, image uploads, payments, and newsletter.

---

## 🚀 Quick Start (Railway Deployment)

### Step 1 — Prerequisites
- Node.js 18+
- A Railway account (railway.app) — free tier works
- A Cloudinary account (cloudinary.com) — free tier works
- A SendGrid account (sendgrid.com) — free tier: 100 emails/day
- A Stripe account (stripe.com) — test mode is fine to start

---

### Step 2 — Database (PostgreSQL on Railway)
1. Go to **railway.app** → New Project → Add **PostgreSQL**
2. Click the PostgreSQL service → **Connect** tab
3. Copy the `DATABASE_URL` connection string

---

### Step 3 — Environment Variables
Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Required variables:
```
DATABASE_URL=         # From Railway PostgreSQL
NEXTAUTH_URL=         # Your deployed URL e.g. https://jaytech.railway.app
NEXTAUTH_SECRET=      # Run: openssl rand -base64 32

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=  # Must be a verified sender in SendGrid
SENDGRID_FROM_NAME=   # Jay TechWave Solutions
ADMIN_EMAIL=          # jaytechwavesolutions@gmail.com

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=  # Same as NEXTAUTH_URL
```

---

### Step 4 — Install & Setup
```bash
npm install
npm run db:push        # Create all database tables
npm run db:seed        # Seed default content + admin user
npm run dev            # Start local dev server
```

---

### Step 5 — First Login
Visit `http://localhost:3000/admin/login`

```
Email:    admin@jaytechwavesolutions.com
Password: admin123!
```

**⚠️ Change this password immediately in Settings!**

---

### Step 6 — Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login & deploy
railway login
railway init
railway up
```

Or connect your GitHub repo in the Railway dashboard for automatic deployments on every push.

Set all environment variables in Railway → Your Service → Variables.

---

## 📋 Admin Dashboard Features

| Feature | URL | Description |
|---|---|---|
| Dashboard | `/admin` | Stats overview, recent messages, quick actions |
| Messages | `/admin/messages` | All contact form submissions with reply functionality |
| Blog Posts | `/admin/blogs` | Create, edit, publish/draft, delete posts |
| Portfolio | `/admin/portfolio` | Add/edit/remove portfolio projects |
| Team | `/admin/team` | Manage team member profiles |
| Subscribers | `/admin/subscribers` | View all newsletter subscribers |
| Newsletter | `/admin/newsletter` | Compose and send newsletters |
| Media | `/admin/media` | Upload and manage images/PDFs |
| Payments | `/admin/payments` | View Stripe payment records |
| Settings | `/admin/settings` | Everything: brand, logo, colors, social links, hero content, stats, contact info |

---

## ✉️ Email Flows (SendGrid)
- **Contact form** → Admin gets notification → Admin replies from dashboard → Client receives the reply
- **Newsletter subscribe** → Subscriber gets confirmation email → Once confirmed, active on list
- **Blog published** → All active subscribers get notified automatically
- **Newsletter broadcast** → Send to all active subscribers from admin panel
- **Unsubscribe** → Token-based unsubscribe link in every email

---

## 🎨 Dynamic Theme
In Admin → Settings → Theme:
- Switch between **dark** and **light** mode as the site default
- Change primary color (teal), accent color (blue), and background colors
- Changes apply to all pages immediately after saving

Users can also toggle dark/light mode using the moon/sun button in the nav.

---

## 🖼️ Images & Files (Cloudinary)
Every image in the site is replaceable from the admin:
- **Logo** → Settings → Brand → Upload Logo
- **Hero image** → Settings → Hero → Upload Hero Image
- **Blog post covers** → Blog editor → Upload Image
- **Portfolio images** → Portfolio editor → Upload Image
- **Team photos** → Team editor → Upload Photo
- **Services PDF** → Settings → Brand → Upload PDF
- **Media Library** → `/admin/media` → Upload anything, copy URL

---

## 💳 Payments (Stripe)
Stripe is integrated and ready. To enable:
1. Add your Stripe keys to `.env`
2. Use the `/api/payments/create-intent` endpoint to create payment intents
3. Set up the webhook at `https://yourdomain.com/api/payments/webhook`
4. View all payments at `/admin/payments`

---

## 🗂️ Project Structure
```
src/
├── app/
│   ├── (public)/         # All public-facing pages
│   │   ├── page.tsx      # Homepage
│   │   ├── about/
│   │   ├── services/
│   │   ├── portfolio/
│   │   ├── blog/
│   │   ├── pricing/
│   │   ├── team/
│   │   ├── contact/
│   │   ├── privacy/
│   │   └── terms/
│   ├── admin/            # Admin dashboard (auth-protected)
│   │   ├── messages/
│   │   ├── blogs/
│   │   ├── portfolio/
│   │   ├── team/
│   │   ├── subscribers/
│   │   ├── newsletter/
│   │   ├── media/
│   │   ├── payments/
│   │   └── settings/
│   └── api/              # All API routes
│       ├── auth/
│       ├── contact/
│       ├── subscribe/
│       ├── blog/
│       ├── portfolio/
│       ├── payments/
│       └── admin/
├── components/
│   ├── Nav.tsx           # Dynamic nav
│   ├── Footer.tsx        # Dynamic footer
│   ├── ContactForm.tsx   # Contact form
│   ├── ScrollReveal.tsx  # Animation
│   ├── ThemeProvider.tsx # Dark/light mode
│   └── admin/
│       └── AdminSidebar.tsx
├── lib/
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # NextAuth config
│   ├── sendgrid.ts       # All email functions
│   ├── cloudinary.ts     # Image upload
│   └── settings.ts       # Site settings helper
└── middleware.ts         # Route protection
```

---

## 🔧 Common Commands
```bash
npm run dev            # Development server
npm run build          # Production build
npm run db:studio      # Open Prisma Studio (visual DB editor)
npm run db:migrate     # Run new migrations
npm run db:seed        # Re-seed default data
```

---

## 📞 Support
For help setting this up, contact: jaytechwavesolutions@gmail.com
