# 🌟 SocialHub — Modern Social Management & Events Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-v1.7-indigo?style=for-the-badge)](https://better-auth.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Upload-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://socialwork-kappa.vercel.app/)

> **SocialHub** is a production-grade, full-stack social events management web application designed for discovering, organizing, and joining community gatherings, conferences, sports meetups, and workshops in real time.

---

## 🔗 Live URLs

- **Frontend Application:** [https://socialwork-kappa.vercel.app](https://socialwork-kappa.vercel.app)
- **Backend API (Express.js):** [https://mysocial-omega.vercel.app](https://mysocial-omega.vercel.app)
- **Backend Health Check:** [https://mysocial-omega.vercel.app/health](https://mysocial-omega.vercel.app/health)
- **GitHub Repository:** [https://github.com/babulpro/socialwork](https://github.com/babulpro/socialwork)

---

## ✨ Features at a Glance

### 1. 🧭 Event Discovery & Exploration
- **Real-Time Feed:** Browse events published across the community with date, location, category badges, and occupancy indicators.
- **Dynamic Search & Filters:** Instant live search by title, description, or venue location. Filter across 8 categories (*Tech, Social, Sports, Workshops, Music, Food, Art, Other*) and sort by upcoming date or creation time.
- **Spot Urgency & Capacity Progress:** Visual occupancy progress bar with badges indicating remaining seats or capacity limits.

### 2. ⚡ Instant RSVP & Attendee Management
- **One-Click RSVP:** Join or leave any event instantly with synchronized attendee counts and optimistic UI updates.
- **Attendee Directory:** View fellow attendees with personalized avatar chips and initials.
- **Organizer Safeguards:** Organizers have dedicated management controls, including event deletion and attendee overview.

### 3. 📸 Cloudinary Media Integration
- **Direct Image Uploads:** Seamless file uploads through Cloudinary v2 SDK (`/api/upload`) with drag-and-drop or file picker.
- **Dual Mode:** Choose between uploading a local file or providing a direct image URL.
- **Live Card Preview:** Real-time WYSIWYG card preview while composing an event title, date, time, location, and cover image.

### 4. 🎨 Day, Night & Custom Mood System
- ☀️ **Day Mode:** Crisp high-clarity daylight theme with high contrast and clean typography.
- 🌙 **Night Mode:** Deep obsidian canvas with soft violet luminescence and sleek glassmorphic surfaces.
- 🎨 **5 Curated Mood Presets:**
  - 🌅 **Sunset Glow:** Warm amber, dusk tangerine, and glowing coral radiance.
  - 🌲 **Emerald Oasis:** Lush jade, forest mint, and organic calm vitality.
  - 💜 **Cyber Violet:** Electric synthwave purple and neon magenta.
  - 🌊 **Oceanic Azure:** Bioluminescent cyan and coastal deep azure.
  - ☕ **Warm Mocha:** Caramel bronze, roasted espresso, and fireside amber.
- 🎛️ **Personal Palette Customizer:** Color wheel and signature hex swatch picker for total visual freedom.
- 🌓 **Atmosphere Canvas Selector:** Toggle between **Dark Canvas** or **Light Canvas** for any active mood.
- ⚡ **Zero-FOUC:** Synchronous inline script in `<head>` eliminates theme flickering on initial page load, and the `storage` event syncs themes across open browser tabs.

### 5. 📱 Mobile-First Native App Experience
- **Bottom Navigation Bar:** Dedicated mobile navigation bar with quick thumb access to Home, Explore, Host (+), Dashboard, and Settings.
- **Elevated Host Action:** Floating action button in the center for quick event creation on mobile.
- **Mobile Safari Auto-Zoom Prevention:** Form inputs designed with `text-base sm:text-sm` to prevent unwanted iOS viewport shifts.
- **Safe-Area Inset Support:** Fully compatible with iPhone Home Indicator bars (`.pb-safe`) and notch displays.

### 6. 🔒 Authentication & Route Protection
- **Better Auth Integration:** Secure authentication powered by MongoDB Atlas.
- **Multi-Provider Support:** Email/password credentials, Google OAuth 2.0, and Facebook Login.
- **Next.js 16 `proxy.ts` Middleware:** Official Next.js 16 proxy convention inspecting session cookies (`better-auth.session_token` and `__Secure-better-auth.session_token`) to guard private routes (`/dashboard`, `/settings`, `/events/new`).

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.4.5** | Turbopack, App Router, Server/Client components, Partial Prerendering |
| **UI Library** | **React 19.3.0** | Modern React with React Compiler optimizations |
| **Styling** | **Tailwind CSS v4** | CSS-first configuration, `@theme inline`, `@custom-variant dark` |
| **Icons** | **Lucide React & Gravity UI** | Sleek SVG iconography |
| **Authentication** | **Better Auth v1.7** | Sessions, MongoDB Atlas adapter, OAuth (Google & Facebook) |
| **Media Hosting** | **Cloudinary v2** | Cloud image uploads and optimization |
| **Backend API** | **Express.js & Node.js** | RESTful microservice deployed on Vercel |
| **Database** | **MongoDB Atlas** | Cloud NoSQL database with Mongoose ODM |
| **Deployment** | **Vercel** | CI/CD auto-deployments for frontend and backend |

---

## 📁 Project Architecture

```
social-client/
├── public/                     # Static assets and favicon files
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/[...all]/  # Better Auth API handler
│   │   │   ├── events/         # Event proxy routes to backend
│   │   │   │   ├── [id]/       # Event details & delete
│   │   │   │   │   └── join/   # Join/leave event toggle
│   │   │   │   └── user/
│   │   │   │       └── my-events/ # Events hosted by current user
│   │   │   └── upload/         # Cloudinary image upload API endpoint
│   │   ├── dashboard/          # User Dashboard (Created vs Joined tabs)
│   │   ├── events/
│   │   │   ├── page.tsx        # Event discovery & exploration feed
│   │   │   ├── [id]/           # Event details & RSVP registration
│   │   │   ├── create/         # Event creation with live preview
│   │   │   └── new/            # Re-export route for /events/new
│   │   ├── settings/           # Account profile & Display/Mood customizer
│   │   ├── sign-in/            # Email + Google + Facebook sign in
│   │   ├── sign-up/            # Account registration
│   │   ├── globals.css         # Tailwind v4 tokens & mood theme variables
│   │   ├── layout.tsx          # Root layout with zero-FOUC script & viewport
│   │   ├── page.tsx            # Landing page with hero glow & event feed
│   │   ├── providers.tsx       # React context provider wrapper
│   │   └── icon.svg            # Modern SVG squircle favicon
│   ├── components/
│   │   ├── EventCard.tsx       # Reusable responsive event card
│   │   ├── MobileBottomNav.tsx # Native mobile bottom app navigation bar
│   │   ├── ThemeMoodSwitcher.tsx # Interactive theme/mood switcher dropdown
│   │   └── TopNavbar.tsx       # Desktop & mobile responsive header navbar
│   ├── context/
│   │   └── ThemeContext.tsx    # Day/Night/Custom Mood state & persistence
│   ├── lib/
│   │   ├── api.ts              # API client wrapper with credentials
│   │   ├── auth.ts             # Server-side Better Auth initialization
│   │   ├── auth-client.ts      # Client-side Better Auth SDK
│   │   └── proxy.ts            # Backend API proxy helper
│   ├── types/
│   │   └── index.ts            # TypeScript definitions (Event, User, etc.)
│   └── proxy.ts                # Next.js 16 route protection & proxy entry
├── next.config.ts              # Next.js build & Cloudinary remote images config
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js:** v18.18 or higher (Node 20+ recommended)
- **Package Manager:** npm, pnpm, or yarn
- **MongoDB Atlas Database URI**
- **Cloudinary Account:** Cloud Name, API Key, API Secret (or `CLOUDINARY_URL`)
- **OAuth Credentials (Optional):** Google OAuth Client ID & Secret, Facebook App ID & Secret

---

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/babulpro/socialwork.git
   cd socialwork
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Backend API Endpoint
   NEXT_PUBLIC_API_URL=https://mysocial-omega.vercel.app/api
   # For local backend development, use:
   # NEXT_PUBLIC_API_URL=http://localhost:5000/api

   # Better Auth Configuration
   BETTER_AUTH_SECRET=your_super_secret_key_at_least_32_characters_long
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/socialwork?retryWrites=true&w=majority

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Facebook OAuth (Optional)
   FACEBOOK_CLIENT_ID=your-facebook-app-id
   FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

   # Cloudinary Image Upload
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
   CLOUDINARY_CLOUD_NAME=<cloud_name>
   CLOUDINARY_API_KEY=<api_key>
   CLOUDINARY_API_SECRET=<api_secret>
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📡 API Proxy Architecture

All frontend event requests route securely through Next.js 16 API endpoints (`/api/events/*`), which automatically forward authenticated session cookies and headers to the Express backend (`https://mysocial-omega.vercel.app/api`):

| Method | Next.js Client Route | Backend Forward Target | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/events` | `/events` | List all events with search, category, and sort filters |
| **POST** | `/api/events` | `/events` | Create a new event (Authenticated) |
| **GET** | `/api/events/:id` | `/events/:id` | Get single event details |
| **DELETE** | `/api/events/:id` | `/events/:id` | Delete event (Organizer only) |
| **POST** | `/api/events/:id/join` | `/events/:id/join` | Toggle RSVP (Join / Leave event) |
| **GET** | `/api/events/user/my-events` | `/events/user/my-events` | Retrieve events hosted by current user |
| **POST** | `/api/upload` | Cloudinary API | Upload and optimize event cover image |

---

## 🎨 Theme & Mood Design System

SocialHub uses a CSS token architecture compatible with Tailwind CSS v4:

- **Root Color Scheme:** Declared via `<meta name="color-scheme" content="light dark">` in `<head>` and `:root { color-scheme: light dark; }`.
- **CSS Variables:**
  - `--background`: Canvas background color
  - `--foreground`: Text typography color
  - `--primary`: Active theme/mood accent color
  - `--primary-rgb`: RGB triplet for dynamic glow computation
  - `--primary-glow`: Soft luminescence shadow
  - `--primary-subtle`: Subtle pill and badge tint
  - `--gradient-accent`: Curated gradient for buttons and active indicators
- **Utility Classes:**
  - `.btn-primary-glow`: Elevated gradient button with dynamic glow shadow.
  - `.badge-mood`: Atmospheric badge matching the active mood.
  - `.text-primary-themed`: Dynamic text accent inheriting active mood color.

---

## 🚢 Deployment to Vercel

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete SocialHub platform"
   git push origin main
   ```
2. In the **Vercel Dashboard**:
   - Link your GitHub repository.
   - Add all environment variables from `.env.local` (ensure `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` are set to your production domain, e.g. `https://socialwork-kappa.vercel.app`).
   - Trigger the deployment.
3. In **Google Cloud Console** & **Meta Developer Portal**:
   - Add your production callback URLs:
     - Google: `https://socialwork-kappa.vercel.app/api/auth/callback/google`
     - Facebook: `https://socialwork-kappa.vercel.app/api/auth/callback/facebook`
     - Facebook App Domains: `socialwork-kappa.vercel.app` (without `https://`)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Built with ❤️ for community organizers and social gatherings.*
