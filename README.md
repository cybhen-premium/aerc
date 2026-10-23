# AERCGH – Alliance for Empowering Rural Communities

Official web platform for the **Alliance for Empowering Rural Communities (AERC Ghana)**, built with **Next.js (App Router)**, **Drizzle ORM**, and **Neon PostgreSQL**.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [Neon Serverless PostgreSQL](https://neon.tech/)
- **ORM & Migrations**: [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- **Styling**: Tailored Modern Vanilla CSS with responsive design system
- **Icons**: FontAwesome 6 & Lucide React
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *Alata*)

---

## 📁 Project Structure

```text
aerc/
├── public/                 # Static public assets (images, logos, banners)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── about/          # About Us page
│   │   ├── blog/           # Blog listing & dynamic [slug] detail pages
│   │   ├── contact/        # Contact Us page with interactive inquiry form
│   │   ├── festival/       # Youth Climate Joy and Healing Festival 2026 page
│   │   ├── partner/        # Become a Partner application page
│   │   ├── projects/       # Projects showcase & dynamic [slug] detail pages
│   │   ├── resources/      # Publications & research downloads
│   │   ├── volunteer/      # Volunteer application page
│   │   ├── actions.ts      # Next.js Server Actions for forms
│   │   ├── globals.css     # Global responsive styles
│   │   ├── layout.tsx      # Root HTML layout with font imports
│   │   └── page.tsx        # Homepage
│   ├── components/         # Modular client & server components
│   │   ├── ContactForm.tsx
│   │   ├── PartnerForm.tsx
│   │   ├── VolunteerForm.tsx
│   │   ├── NewsletterForm.tsx
│   │   ├── Navigation.tsx
│   │   ├── TopBar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   └── db/                 # Database layer
│       ├── index.ts        # Neon DB connection with graceful fallback
│       ├── schema.ts       # Drizzle PostgreSQL table schemas
│       └── seed-data.ts    # Authentic fallback & initial seed data
├── drizzle.config.ts       # Drizzle Kit configuration
├── next.config.mjs         # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## 🗄️ Database Setup (Neon + Drizzle ORM)

1. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your Neon connection string:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

2. **Push Schema to Neon Database**:
   ```bash
   npm run db:push
   ```

3. **Explore Database with Drizzle Studio**:
   ```bash
   npm run db:studio
   ```

> **Note**: The application is architected with graceful fallback data in `src/db/seed-data.ts`. Even without an active `DATABASE_URL`, all pages, projects, blogs, and resources render completely and forms record submissions gracefully.

---

## 💻 Development & Production

- **Run Development Server**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Build Production Bundle**:
  ```bash
  npm run build
  ```

- **Run Production Server**:
  ```bash
  npm run start
  ```

---

## 🌐 Routes Overview

- `/` – Homepage featuring hero slider, key statistics, focus areas, latest news, and CTA
- `/about` – Full organizational profile, mission, vision, core values, and executive team
- `/projects` – Interactive portfolio of grassroots climate and sustainability projects
- `/projects/[slug]` – Deep-dive project pages (e.g. `/projects/kuvuna-project`)
- `/blog` – Community stories, movement insights, and campaign updates
- `/blog/[slug]` – Individual article reading view
- `/resources` – Policy briefs, VNR shadow reports, and research publications
- `/contact` – Contact details, direct messaging form, and embedded map
- `/partner` – Institutional & corporate partnership application form
- `/volunteer` – Grassroots volunteer registration form
- `/festival` – Youth Climate Joy and Healing Festival 2026 registration & briefing
