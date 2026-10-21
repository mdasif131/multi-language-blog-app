# 🌍 Multi-Lingual Health & Wellness Blog

A high-performance, multi-language health-focused blog platform built with Next.js 16, designed to deliver health, nutrition, and sports articles globally with automated push notifications and Google AdSense optimization.

---

## 🚀 Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Database & ORM:** [Neon DB](https://neon.tech/) (Serverless PostgreSQL) + [Prisma ORM](https://www.prisma.io/)
* **Authentication:** [Better Auth](https://better-auth.com/) (Google & Facebook Social Login)
* **Storage:** Cloudflare Tigris (S3-compatible object storage)
* **Internationalization:** `next-intl` (Localized routing & dynamic translations)
* **Notifications:** Firebase Cloud Messaging (FCM) for targeted push notifications
* **Styling & Validation:** Tailwind CSS, Zod

---

## 🌐 Supported Locales (`7 Languages`)

1. English (`en`)
2. Bengali (`bn`)
3. Hindi (`hi`)
4. Arabic (`ar` - RTL layout support)
5. Japanese (`ja`)
6. Korean (`ko`)
7. Singapore English (`en-SG`)

---

## ✨ Key Features

* **Localized URL Routing:** SEO-optimized locale prefixing (`/en`, `/bn`, `/ar`, etc.).
* **Category Management:** Dynamic creation and localization for categories like **Health**, **Nutrition**, and **Sports**.
* **Automated FCM Push Notifications:** Instant browser alerts dispatched automatically to language-specific subscribers whenever a new post is published.
* **Admin Portal:** Secure dashboard to manage posts, categories, and automated slug generation.
* **Google AdSense Ready:** Pre-built placeholders and essential policy pages (Privacy Policy, Contact Us, Terms/About).

---

## ⚙️ Getting Started & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/multi-lang-health-blog.git
cd multi-lang-health-blog
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root folder and supply the following variables:

```env
# Database (Neon DB)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your_better_auth_secret"
BETTER_AUTH_URL="http://localhost:3000"

# Firebase Cloud Messaging (Client)
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="your_vapid_key"

# Firebase Admin SDK (Server)
FIREBASE_PROJECT_ID="your_project_id"
FIREBASE_CLIENT_EMAIL="your_client_email"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----\n"

# Cloudflare Tigris S3 Storage
TIGRIS_ENDPOINT="your_tigris_endpoint"
TIGRIS_BUCKET_NAME="your_bucket_name"
TIGRIS_ACCESS_KEY_ID="your_access_key"
TIGRIS_SECRET_ACCESS_KEY="your_secret_key"
```

### 4. Sync Database Schema
```bash
npx prisma db push
```

### 5. Launch Development Server
```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser.

---

## 📂 Project Directory Structure

```text
├── app/
│   ├── [lang]/              # Localized App Router pages
│   │   ├── admin/           # Dashboard (Post/Category creation)
│   │   ├── category/        # Dynamic category listings
│   │   ├── posts/           # Blog post detail pages
│   │   ├── layout.tsx       # Root localized layout
│   │   └── page.tsx         # Landing page
│   └── api/                 # API endpoints & Better Auth routes
├── components/              # UI components
├── lib/                     # Firebase, Prisma, and utility clients
├── messages/                # Translation files (en.json, bn.json, etc.)
├── prisma/                  # Prisma schema models
└── public/                  # Service worker (sw.js) & static assets
```

---

## 📜 License
This project is licensed under the MIT License.
