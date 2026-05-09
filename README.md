# 🍦 Moore's Ice Cream — Premium Online Ordering Platform

<div align="center">

![Moore's Ice Cream Banner](https://img.shields.io/badge/Moore's-Ice%20Cream-orange?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJhNSA1IDAgMCAxIDUgNUg3YTUgNSAwIDAgMSA1LTV6bS03IDdoMTRsLTIgMTNIN0w1IDl6Ii8+PC9zdmc+)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

**A full-stack, production-ready ice cream ordering platform for Moore's Premium Ice Cream**

[🌐 Live Demo](#) · [📦 Features](#-features) · [🚀 Getting Started](#-getting-started) · [⚙️ Environment Setup](#️-environment-variables)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Admin Dashboard](#-admin-dashboard)
- [Order Flow](#-order-flow)
- [Environment Variables](#️-environment-variables)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Integrations](#-integrations)
- [Contact](#-contact)

---

## 🧁 About the Project

**Moore's Ice Cream** is a premium handcrafted ice cream brand. This platform is the official online ordering system, built to make it easy for customers to:

- Browse **10+ ice cream flavors** with immersive scroll animations
- **Add to cart** and manage their wishlist
- **Place orders** with GPS delivery tracking
- **Pay via UPI/PhonePe or Cash on Delivery**
- **Receive auto-generated PDF receipts** and email confirmations
- **Schedule callback calls** with the Moore's team

The business owner uses the **Admin Dashboard** to track orders, manage scheduled customer calls, and view analytics — all from a secure, password-protected admin panel.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4, CSS Modules |
| **UI Components** | Radix UI, shadcn/ui |
| **Animations** | Framer Motion, Canvas API (scrollytelling) |
| **Database** | MongoDB Atlas |
| **Email** | Nodemailer (Gmail SMTP) |
| **Maps** | Leaflet.js + React Leaflet (delivery location) |
| **PDF Export** | jsPDF + jsPDF AutoTable |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Analytics** | Vercel Analytics |
| **Deployment** | Vercel |
| **Font** | Fredoka (Google Fonts) |

---

## ✨ Features

### 🛒 Customer Features

- **Canvas Scrollytelling** — Scroll-driven 40-frame animations for each ice cream flavor with color-matched backgrounds
- **Flavor Catalog** — Browse all flavors with images, descriptions, and pricing
- **Cart System** — Real-time add/remove with quantity management and localStorage persistence
- **Wishlist** — Save favorite flavors for later
- **Order Form** — Place orders with:
  - Flavor selection + live pricing
  - GPS location capture (Browser API + IP fallback)
  - Interactive map to confirm delivery pin (Leaflet)
  - Delivery date picker
  - Stall/address details
  - Inquiry type selector (Order, Bulk, Catering, etc.)
- **Payment Options**
  - 💜 **UPI / PhonePe** — QR code generation for instant payment
  - 💚 **Cash on Delivery** — Pay on delivery
- **PDF Receipt** — Auto-generated PDF receipt downloaded on order confirmation
- **Email Confirmation** — Automatic order confirmation sent to store email
- **Schedule a Call** — Customers can book a callback from the Moore's team
- **AI Chatbot** — Built-in chatbot assistant for common queries
- **Toast Notifications** — Real-time feedback for cart actions and order status

### 🔐 Admin Features

- **Admin Login** — Password-protected admin panel
- **Admin Dashboard** — Overview of the business
- **Order Management** — View all submitted orders in MongoDB
- **Calls Calendar** — View and manage all scheduled customer callbacks in a calendar view
- **Analytics** — Visual charts for order stats
- **Google Sheets Sync** — Orders synced to a Google Sheet via Sheets API
- **Make.com Webhook** — Automation trigger for custom workflows

---

## 📁 Project Structure

```
moores-main/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout (font, header, analytics)
│   ├── globals.css               # Global styles
│   ├── admin/                    # Admin panel (protected)
│   │   ├── login/                # Admin login page
│   │   ├── dashboard/            # Admin dashboard
│   │   └── calls/                # Scheduled calls calendar
│   ├── api/                      # Backend API routes
│   │   ├── submit-order/         # POST: Save order to MongoDB + send email
│   │   ├── orders/               # GET: Retrieve all orders
│   │   ├── schedule-call/        # POST: Save scheduled call
│   │   ├── clients/              # GET: Client data
│   │   ├── chatbot/              # POST: AI chatbot response
│   │   ├── analytics/            # GET: Analytics data
│   │   ├── send-order-email/     # POST: Resend order email
│   │   └── sync-sheets/          # POST: Sync orders to Google Sheets
│   ├── cart/                     # Cart page
│   ├── wishlist/                 # Wishlist page
│   ├── checkout/                 # Checkout flow
│   ├── contact/                  # Contact & Order page
│   ├── flavors/                  # Individual flavor page (with canvas animation)
│   └── flavors-list/             # All flavors listing page
│
├── components/                   # Reusable UI components
│   ├── header.tsx                # Navigation bar
│   ├── footer.tsx                # Footer
│   ├── hero.tsx                  # Landing hero section
│   ├── ice-cream-catalog.tsx     # Flavor catalog grid
│   ├── contact-section.tsx       # Full order form with GPS & payment
│   ├── CanvasScrollAnimation.tsx # Universal canvas scrollytelling (all flavors)
│   ├── VanillaScrollAnimation.tsx# Vanilla-specific canvas animation
│   ├── FlavorScrollAnimation.tsx # Image-based scroll animation
│   ├── LeafletLocationPicker.tsx # Interactive delivery map
│   ├── payment-qr.tsx            # UPI QR code generator
│   ├── schedule-call.tsx         # Call scheduling form
│   ├── calls-calendar.tsx        # Admin calendar for scheduled calls
│   ├── admin-chatbot.tsx         # Admin AI assistant
│   ├── cart-sheet.tsx            # Slide-out cart panel
│   ├── wishlist-sheet.tsx        # Slide-out wishlist panel
│   ├── announcement-bar.tsx      # Top announcement banner
│   ├── location-selector.tsx     # Location detection component
│   └── ui/                       # shadcn/ui primitives
│
├── lib/                          # Utility functions
│   ├── flavor-data.ts            # All flavor definitions (name, price, description, etc.)
│   ├── cart-store.ts             # Cart state management (localStorage)
│   ├── pdf-export.ts             # jsPDF receipt generation
│   └── mongodb.ts                # MongoDB connection utility
│
├── models/
│   └── Call.ts                   # Mongoose model for scheduled calls
│
├── public/                       # Static assets
│   ├── vanilla-sequence/         # 40 frames for vanilla animation
│   ├── chocolate-sequence/       # 40 frames for chocolate animation
│   ├── strawberry-sequence/      # 40 frames for strawberry animation
│   ├── mango-sequence/           # ...and 7 more flavor sequences
│   ├── Upi.mp4                   # UPI payment background video
│   └── Cash.mp4                  # Cash on delivery background video
│
├── styles/                       # Additional stylesheets
├── .env.local                    # Environment variables (not committed)
├── next.config.mjs               # Next.js config
├── tailwind.config.ts            # Tailwind CSS config
└── tsconfig.json                 # TypeScript config
```

---

## 🗺 Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero, catalog, contact section |
| `/flavors-list` | All flavors grid view |
| `/flavors/[id]` | Individual flavor page with canvas scroll animation |
| `/cart` | Shopping cart |
| `/wishlist` | Saved wishlist |
| `/checkout` | Checkout page |
| `/contact` | Contact & Order form page |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin order management |
| `/admin/calls` | Customer call scheduling calendar |

---

## 🎬 Canvas Scrollytelling Animations

Each flavor has a **40-frame scroll-driven animation** built with the Canvas API.

| Flavor | Background | Text |
|---|---|---|
| Vanilla | `#050505` Black | White |
| Chocolate | `#3B2516` Dark Brown | White |
| Caramel Nuts | `#8B4513` Saddle Brown | White |
| Strawberry | `#FFB6C1` Light Pink | Black |
| Mango | `#FFA500` Orange | Black |
| Chikku | `#8B7355` Brown | White |
| Seetapal | `#E8E4D0` Cream | Black |
| Kala Jamun | `#2F1B3C` Dark Purple | White |
| Tutti Frutti | `#FFE4E1` Misty Rose | Black |
| Raj Bhog | `#FFD700` Gold | Black |

**How it works:**
1. User visits `/flavors/{flavor-id}`
2. The page detects if it's a canvas flavor or image flavor
3. For canvas flavors → loads `CanvasScrollAnimation` with color config
4. User scrolls → 40 image frames render sequentially on HTML5 Canvas
5. White overlay sections appear for description, ingredients, and CTA
6. "Add to Cart" button shows toast notification

---

## 🧑‍💼 Admin Dashboard

Access the admin panel at `/admin/login`.

**Admin Capabilities:**
- View all orders from MongoDB in a table
- See total order value, quantities, and delivery dates
- View scheduled customer callback calls in a **React Big Calendar** view
- Sync orders to Google Sheets
- AI assistant chatbot for admin help

---

## 📦 Order Flow

```
Customer selects flavors →  Cart/Direct
         ↓
   Fills order form
   (Name, Phone, Address, Date, Payment)
         ↓
   GPS Location captured
   (Browser API → IP Fallback → Manual)
         ↓
   Chooses payment method:
   UPI (QR Code) or Cash on Delivery
         ↓
   Clicks "Confirm Order"
         ↓
   ┌─────────────────────────────────────┐
   │  /api/submit-order                  │
   │  1. Save order to MongoDB           │
   │  2. Send email via Gmail SMTP       │
   │  3. Trigger Make.com webhook        │
   │  4. Sync to Google Sheets           │
   └─────────────────────────────────────┘
         ↓
   PDF Receipt auto-downloaded
   Toast notification shown
   Form reset
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root. **Never commit this file.**

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# AI Chatbot (Groq API)
GROQ_API_KEY=your_groq_api_key

# Web3Forms (Contact form fallback)
WEB3FORMS_ACCESS_KEY=your_web3forms_key

# Make.com Automation Webhook
MAKE_WEBHOOK_URL=https://hook.eu1.make.com/your_webhook_path

# Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_google_sheet_id
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- MongoDB Atlas account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/moores-ice-cream.git
cd moores-ice-cream

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Fill in your values in .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/submit-order` | Submit a new order (MongoDB + Email + Webhook) |
| `GET` | `/api/orders` | Get all orders |
| `POST` | `/api/schedule-call` | Schedule a customer callback |
| `GET` | `/api/clients` | Get all clients |
| `POST` | `/api/chatbot` | AI chatbot query |
| `GET` | `/api/analytics` | Get analytics data |
| `POST` | `/api/send-order-email` | Resend order confirmation email |
| `POST` | `/api/sync-sheets` | Sync orders to Google Sheets |

---

## 🔗 Integrations

| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Stores all orders and scheduled calls |
| **Gmail SMTP (Nodemailer)** | Sends order confirmation emails to `moores1807@gmail.com` |
| **Leaflet.js + OpenStreetMap** | Interactive delivery location map |
| **Nominatim (OpenStreetMap)** | Reverse geocoding for address display |
| **ipapi.co** | IP-based geolocation fallback |
| **Make.com** | Automation workflows triggered on new orders |
| **Google Sheets API** | Order data synced to a spreadsheet |
| **Vercel Analytics** | Page view and user tracking |
| **Groq API** | AI-powered chatbot responses |
| **Web3Forms** | Contact form backup submission |

---

## 📱 Contact Information

> **Moore's Ice Cream**
> 📞 Phone: [6309312041](tel:6309312041)
> 📧 Email: [moores1807@gmail.com](mailto:moores1807@gmail.com)

---

## 📝 License

This project is private and proprietary to Moore's Ice Cream.
All rights reserved © 2025 Moore's Ice Cream.

---

<div align="center">

Made with ❤️ and 🍦 for Moore's Ice Cream

</div>
