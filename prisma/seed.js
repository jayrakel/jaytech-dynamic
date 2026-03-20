// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ──────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jaytechwavesolutions.com' },
    update: {},
    create: {
      name: 'Julius M.',
      email: 'admin@jaytechwavesolutions.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ── Default site settings ───────────────────────────────
  const defaultSettings = [
    // Brand
    { key: 'site_name',        value: 'Jay TechWave Solutions', type: 'string', group: 'brand',   label: 'Site Name' },
    { key: 'site_tagline',     value: "Nairobi's Premier IT Company", type: 'string', group: 'brand', label: 'Tagline' },
    { key: 'site_description', value: 'We deliver web development, digital marketing, app development, cloud solutions and cybersecurity services that grow your business.', type: 'string', group: 'brand', label: 'Site Description' },
    { key: 'logo_url',         value: '', type: 'string', group: 'brand', label: 'Logo URL' },
    { key: 'favicon_url',      value: '', type: 'string', group: 'brand', label: 'Favicon URL' },
    { key: 'services_pdf_url', value: '', type: 'string', group: 'brand', label: 'Services PDF URL' },

    // Contact
    { key: 'contact_email',   value: 'jaytechwavesolutions@gmail.com', type: 'string', group: 'contact', label: 'Contact Email' },
    { key: 'contact_phone_1', value: '+254716962489', type: 'string', group: 'contact', label: 'Phone 1' },
    { key: 'contact_phone_2', value: '+254100310330', type: 'string', group: 'contact', label: 'Phone 2' },
    { key: 'contact_address', value: '472-00200 Nairobi, Kenya', type: 'string', group: 'contact', label: 'Address' },
    { key: 'business_hours',  value: 'Mon–Fri: 8AM–6PM · Sat: 9AM–2PM', type: 'string', group: 'contact', label: 'Business Hours' },

    // Social
    { key: 'social_facebook',  value: 'https://web.facebook.com/me/', type: 'string', group: 'social', label: 'Facebook URL' },
    { key: 'social_instagram', value: 'https://instagram.com', type: 'string', group: 'social', label: 'Instagram URL' },
    { key: 'social_linkedin',  value: 'https://linkedin.com', type: 'string', group: 'social', label: 'LinkedIn URL' },
    { key: 'social_twitter',   value: 'https://twitter.com', type: 'string', group: 'social', label: 'X / Twitter URL' },
    { key: 'social_youtube',   value: 'https://youtube.com', type: 'string', group: 'social', label: 'YouTube URL' },

    // Theme
    { key: 'theme_mode',        value: 'dark', type: 'string', group: 'theme', label: 'Default Theme Mode' },
    { key: 'theme_accent_teal', value: '#14B8A6', type: 'color', group: 'theme', label: 'Primary Color (Teal)' },
    { key: 'theme_accent_blue', value: '#3B82F6', type: 'color', group: 'theme', label: 'Accent Color (Blue)' },
    { key: 'theme_bg_dark',     value: '#0D1421', type: 'color', group: 'theme', label: 'Dark Background' },
    { key: 'theme_bg_light',    value: '#F8FAFC', type: 'color', group: 'theme', label: 'Light Background' },

    // Hero
    { key: 'hero_title',    value: 'We Build Digital Solutions That Drive Real Growth', type: 'string', group: 'hero', label: 'Hero Title' },
    { key: 'hero_subtitle', value: "From web development and mobile apps to cloud infrastructure and digital marketing — Jay TechWave Solutions is the technology partner Kenya's businesses trust.", type: 'string', group: 'hero', label: 'Hero Subtitle' },
    { key: 'hero_image',    value: '', type: 'string', group: 'hero', label: 'Hero Image URL' },
    { key: 'hero_cta_primary',   value: 'Start Your Project', type: 'string', group: 'hero', label: 'Primary CTA Text' },
    { key: 'hero_cta_secondary', value: 'Explore Services', type: 'string', group: 'hero', label: 'Secondary CTA Text' },

    // Stats
    { key: 'stat_projects',    value: '150+', type: 'string', group: 'stats', label: 'Projects Completed' },
    { key: 'stat_clients',     value: '80+',  type: 'string', group: 'stats', label: 'Happy Clients' },
    { key: 'stat_years',       value: '5+',   type: 'string', group: 'stats', label: 'Years Experience' },
    { key: 'stat_satisfaction',value: '99%',  type: 'string', group: 'stats', label: 'Client Satisfaction' },

    // Notifications
    { key: 'notify_new_message',    value: 'true', type: 'boolean', group: 'notifications', label: 'Email on new contact message' },
    { key: 'notify_new_subscriber', value: 'true', type: 'boolean', group: 'notifications', label: 'Email on new subscriber' },
    { key: 'notify_email',          value: 'jaytechwavesolutions@gmail.com', type: 'string', group: 'notifications', label: 'Admin notification email' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`✅ ${defaultSettings.length} settings seeded`);

  // ── Default services ────────────────────────────────────
  const services = [
    { title: 'Web Development', slug: 'web-development', description: 'Pixel-perfect, performance-optimised websites and web apps that convert visitors into customers.', icon: 'code-slash', features: ['Corporate & business websites', 'E-commerce with M-Pesa integration', 'Custom web applications & portals', 'React, Next.js, Vue.js development', 'SEO-optimised architecture'], order: 1 },
    { title: 'App Development', slug: 'app-development', description: 'Native iOS & Android apps, and cross-platform solutions with Flutter & React Native.', icon: 'phone', features: ['iOS & Android native development', 'Cross-platform with Flutter', 'API integration & backend systems', 'App Store & Play Store submission', 'Push notifications & real-time features'], order: 2 },
    { title: 'Digital Marketing', slug: 'digital-marketing', description: 'Data-driven campaigns that generate qualified leads and measurable ROI.', icon: 'megaphone', features: ['SEO & Google Ads management', 'Social media strategy & content', 'Email marketing & automation', 'Analytics & reporting', 'Conversion rate optimisation'], order: 3 },
    { title: 'Cloud Solutions', slug: 'cloud-solutions', description: 'AWS, Azure, and GCP cloud migrations, architecture, and managed services.', icon: 'cloud-arrow-up', features: ['Cloud migration & architecture', 'Managed cloud infrastructure', 'DevOps, CI/CD & containerisation', 'Cost optimisation & scaling', '24/7 monitoring & support'], order: 4 },
    { title: 'Cybersecurity', slug: 'cybersecurity', description: 'Comprehensive security services to protect your business from evolving threats.', icon: 'shield-lock', features: ['Penetration testing & audits', '24/7 threat monitoring & response', 'Security training & compliance', 'Vulnerability assessments', 'Incident response'], order: 5 },
    { title: 'IT Support & Consulting', slug: 'it-support', description: 'Outsourced IT support and strategic consulting at a fraction of the in-house cost.', icon: 'tools', features: ['24/7 technical helpdesk support', 'IT strategy & technology roadmaps', 'Hardware, software & licensing', 'System administration', 'Network setup & maintenance'], order: 6 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, active: true },
    });
  }
  console.log(`✅ ${services.length} services seeded`);

  // ── Default pricing plans ────────────────────────────────
  const plans = [
    { name: 'Starter', price: '35,000', description: 'Best for small businesses and personal brands getting online.', features: ['Up to 5 pages', 'Mobile-responsive design', 'Contact form integration', 'Basic SEO setup', 'Domain & hosting guidance'], order: 1 },
    { name: 'Business', price: '75,000', description: 'The complete package for growing businesses that mean business.', features: ['Up to 12 pages', 'Custom UI/UX design', 'CMS / Blog integration', 'Advanced SEO & analytics', 'M-Pesa payment integration', 'Social media integration', '3 months free support'], highlighted: true, order: 2 },
    { name: 'Enterprise', price: 'Custom', description: 'Fully bespoke systems for organisations with complex needs.', features: ['Unlimited pages & features', 'Custom web application', 'Full e-commerce platform', 'Multi-payment gateway', 'ERP / CRM integration', 'Dedicated project manager', '12 months priority support'], order: 3 },
  ];

  for (const p of plans) {
    const existing = await prisma.pricingPlan.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.pricingPlan.create({ data: { ...p, active: true } });
    }
  }
  console.log(`✅ ${plans.length} pricing plans seeded`);

  // ── Sample blog post ─────────────────────────────────────
  await prisma.post.upsert({
    where: { slug: 'why-kenyan-businesses-need-mobile-app-2025' },
    update: {},
    create: {
      title: 'Why Every Kenyan Business Needs a Mobile App in 2025',
      slug: 'why-kenyan-businesses-need-mobile-app-2025',
      excerpt: 'Mobile internet usage in Kenya now exceeds desktop by 3:1. We break down why a dedicated mobile app is no longer a luxury.',
      content: '<h2>The Mobile-First Reality</h2><p>Kenya is one of Africa\'s most mobile-connected nations. With over 65% of internet traffic coming from mobile devices, businesses that ignore mobile are leaving money on the table.</p><h2>Why a Mobile App vs Just a Mobile Website?</h2><p>While a responsive website is essential, a dedicated mobile app delivers push notifications, offline functionality, device integration (camera, GPS), and a significantly faster experience that drives repeat engagement.</p><h2>The Business Case</h2><p>Our clients who have launched mobile apps report an average 40% increase in repeat customer engagement and a 25% increase in revenue within 6 months of launch.</p>',
      category: 'Technology',
      tags: ['mobile', 'apps', 'kenya', 'business'],
      published: true,
      featured: true,
      publishedAt: new Date(),
    },
  });
  console.log('✅ Sample blog post seeded');

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Admin Login:');
  console.log('   Email:    admin@jaytechwavesolutions.com');
  console.log('   Password: admin123!');
  console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
