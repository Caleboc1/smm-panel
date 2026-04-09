# SMM Panel — Next.js 15

A full-stack Social Media Marketing panel built with Next.js 15, Prisma, PostgreSQL, and Paystack.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
```
Fill in your values:
- `DATABASE_URL` — PostgreSQL connection string (use [Neon](https://neon.tech) free tier)
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` to generate
- `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` — from [Paystack dashboard](https://dashboard.paystack.com)
- `UPSTREAM_API_URL` / `UPSTREAM_API_KEY` — from your wholesale SMM provider (e.g. [Peakerr](https://peakerr.com), [SMMStone](https://smmstone.com))

### 3. Push database schema
```bash
npx prisma db push
```

### 4. Seed initial data
```bash
npm run db:seed
```
This creates:
- Admin user: `admin@yourpanel.com` / password: `admin123` (**change this immediately**)
- Sample categories and services

### 5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── login/                    # Auth pages
│   ├── register/
│   ├── services/                 # Public services listing
│   ├── api-docs/                 # API documentation
│   ├── dashboard/                # User dashboard (protected)
│   │   ├── page.tsx              # Overview
│   │   ├── new-order/            # Place orders
│   │   ├── orders/               # Order history
│   │   ├── wallet/               # Fund wallet
│   │   ├── api/                  # API key management
│   │   └── settings/             # Profile settings
│   ├── admin/                    # Admin panel (ADMIN role only)
│   │   ├── page.tsx              # Admin overview
│   │   ├── services/             # Manage services
│   │   ├── orders/               # All orders
│   │   └── users/                # All users
│   └── api/
│       ├── auth/                 # NextAuth + register
│       ├── services/             # Public services API
│       ├── categories/           # Categories API
│       ├── orders/               # Orders CRUD
│       ├── user/                 # User profile
│       ├── wallet/               # Paystack fund + verify
│       ├── admin/                # Admin management APIs
│       └── v1/                   # Public reseller API
├── components/
│   ├── landing/                  # Landing page components
│   ├── dashboard/                # Dashboard sidebar + topbar
│   └── Providers.tsx             # Session provider
└── lib/
    ├── prisma.ts                 # Prisma client
    ├── auth.ts                   # NextAuth config
    ├── paystack.ts               # Paystack helpers
    ├── upstream.ts               # Wholesale SMM API wrapper
    └── utils.ts                  # Utilities (formatNGN, calcCharge)
```

---

## 💳 Payment Setup (Paystack)

1. Create account at [paystack.com](https://paystack.com)
2. Get your **Secret Key** and **Public Key** from Settings > API Keys
3. Add webhook URL in Paystack dashboard: `https://yourdomain.com/api/wallet/verify`

---

## 🔌 Upstream SMM API Setup

Connect to a wholesale provider to automatically fulfill orders:

Recommended providers:
- **Peakerr** — https://peakerr.com (has NGN pricing)
- **SMMStone** — https://smmstone.com
- **JustAnotherPanel** — https://justanotherpanel.com

In your `.env`:
```
UPSTREAM_API_URL=https://peakerr.com/api/v2
UPSTREAM_API_KEY=your_api_key_here
```

Services without an `upstreamId` will sit as PENDING and you handle them manually.

---

## 🔑 Reseller API

Your panel exposes a public API for resellers. All requests POST to `/api/v1`:

```json
{ "key": "USER_API_KEY", "action": "services|add|status|balance" }
```

Full docs at `/api-docs` on your live site.

---

## 🛠 Admin Access

After seeding, log in as admin:
- Email: `admin@yourpanel.com`
- Password: `admin123`

**Change the password immediately** via Settings.

Access admin panel at `/admin`.

To make a user admin via Prisma Studio:
```bash
npm run db:studio
```

---

## 🚀 Deployment (Vercel — Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all `.env` variables in Vercel dashboard
4. Deploy

For database, use [Neon](https://neon.tech) (free PostgreSQL):
```
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
```

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (JWT) |
| Payments | Paystack |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Toasts | React Hot Toast |

---

## 🎨 Customization

- **App name**: Change `NEXT_PUBLIC_APP_NAME` in `.env`
- **Colors**: Edit CSS variables in `src/app/globals.css`
- **WhatsApp link**: Update in `LandingFooter.tsx`
- **Telegram link**: Update in `LandingFooter.tsx`

---

Built to be extended. Good luck 🚀
