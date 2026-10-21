# 🌍 Multi-Lingual Health & Wellness Blog

A high-performance, multi-language health-focused blog platform built with modern web technologies, designed to deliver health, nutrition, and sports articles globally.

---

## 🚀 Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Database & ORM:** [Neon DB](https://neon.tech/) (Serverless PostgreSQL) + [Prisma ORM](https://www.prisma.io/)
* **Authentication:** [Better Auth](https://better-auth.com/) (Google & Facebook Social Login)
* **Security & Rate Limiting:** [Arcjet](https://arcjet.com/) (Bot protection, rate limiting, and attack prevention)
* **Storage:** Cloudflare Tigris (S3-compatible object storage for media uploads)
* **Internationalization:** `next-intl` (Static translations & localized routing for 7 languages)
* **Notifications:** Firebase Cloud Messaging (FCM) for real-time push notifications
* **Styling:** Tailwind CSS & Shadcn UI components
* **Validation:** Zod

---

## 🌐 Supported Languages (`7 Locales`)

1. English (`en`)
2. Bengali (`bn`)
3. Hindi (`hi`)
4. Arabic (`ar` - RTL Support)
5. Japanese (`ja`)
6. Korean (`ko`)
7. Singapore English (`en-SG`)

---

## ✨ Key Features

* **Multi-Language Routing:** Dynamic SEO-friendly localized URLs (`/en`, `/bn`, `/ar`, etc.).
* **Category Navigation:** Structured browsing across **Health**, **Nutrition**, and **Sports**.
* **Advanced Security & Protection:** Powered by **Arcjet** for robust rate limiting, bot detection, and safeguarding API endpoints/Server Actions against abuse.
* **Push Notifications:** Instant subscriber alerts via Firebase Cloud Messaging (FCM) when new articles are published.
* **Admin Dashboard:** Secure interface to create and manage categories and blog posts with automatic slug generation.
* **AdSense Ready:** Optimized layout for Google AdSense monetization.
* **Secure Authentication:** Social logins integrated seamlessly using Better Auth.

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
├── lib/                     # Prisma, Firebase, Arcjet & utility functions
├── messages/                # Translation files (en.json, bn.json, etc.)
├── prisma/                  # Prisma schema models
└── public/                  # Service worker (sw.js) & static assets
```
---

## 📜 License
This project is licensed under the MIT License.
