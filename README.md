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
