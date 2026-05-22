# ✈️ SkyBook — Premium Flight Management System

SkyBook is a state-of-the-art, high-fidelity flight booking and management system. Designed with a premium dark-themed aesthetic, fluid animations, and glassmorphic UI depth, SkyBook offers a seamless and responsive airline experience.

## 🚀 Live Deployment
* **Production URL:** [https://flight-management-avtar-007-avtar-007s-projects.vercel.app](https://flight-management-avtar-007-avtar-007s-projects.vercel.app)
* **Alternative Domains:**
  * [flight-management-avtar-007s-projects.vercel.app](https://flight-management-avtar-007s-projects.vercel.app)
  * [flight-management-git-master-avtar-007s-projects.vercel.app](https://flight-management-git-master-avtar-007s-projects.vercel.app)
  * [flight-management-z1w3rzlol-avtar-007s-projects.vercel.app](https://flight-management-z1w3rzlol-avtar-007s-projects.vercel.app)
* **Hosting Platform:** Vercel
* **Database Backend:** Supabase (PostgreSQL)

---

## ✨ Features
* **Premium Theme & Cohesive UI/UX:** A rich, dark-themed experience using HSL-based curated colors, smooth CSS animations, and glassmorphic elements.
* **Interactive Airplane Seat Map:** A detailed, responsive CSS-based airplane fuselage outline that lets passengers visually pick seats, view pricing, and check seat classes (First, Business, Economy) with custom hover tooltips.
* **Real-Time Flight Search:** Instant, dynamic route search between destinations with popular routes quick-chips.
* **Smart Booking Flow:** Staggered, step-by-step progress tracking (Search → Flights → Seats → Book → Confirm) to guide passengers smoothly.
* **Manage Bookings:** View active bookings, cancel flights, or reschedule dates using an interactive modal.
* **Supabase Integration:** Real-time database calls and session-based user authentication.

---

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router, Turbopack)
* **Styling:** Vanilla CSS (Advanced keyframes, HSL tokens, and Media Queries)
* **Animations:** Framer Motion (Staggered list reveals, page transitions, modal scaling)
* **State Management:** Zustand with `persist` middleware
* **Database:** Supabase Serverless Client & PostgreSQL
* **Icons:** Lucide React (Premium SVG vector iconography)

---

## 🗄️ Database Setup & Migrations
All database definitions are saved under the `/supabase` folder:
* **Schema Migration:** Located in [/supabase/migrations/20260522000000_init_schema.sql](file:///e:/flight-management/supabase/migrations/20260522000000_init_schema.sql). This SQL file sets up tables (`flights`, `seats`, `bookings`, `passengers`, `reschedules`), sets up Row Level Security (RLS) policies for user data isolation, and implements custom Pl/pgSQL RPC functions.
* **Seed Script:** Located in [/supabase/seed.sql](file:///e:/flight-management/supabase/seed.sql). This script creates 8 flights across 4 unique routes and generates a complete seat map layout for each flight (First, Business, and Economy classes).

### Supabase RPC Functions:
1. `lock_seat`: Reserves a seat and creates a booking atomically under a database transaction block using `SELECT ... FOR UPDATE` to prevent double-booking race conditions.
2. `cancel_booking`: Cancels a booking, updates seat availability, and enforces a DB-level rule checking that cancellations within 2 hours of departure are blocked.
3. `reschedule_booking`: Transfers a booking to a new flight/seat on the same route, calculates fee adjustments, updates row references, and adds a record to the `reschedules` table.

---

## 📦 State Management (Zustand Stores)
SkyBook utilizes Zustand with `persist` middleware for state management, separated into two focused stores to optimize rendering and persistence behavior:

### 1. `useFlightStore` (Booking Flow State)
Manages the active booking flow and passenger details:
* **State:** `searchQuery`, `selectedFlight`, `selectedSeat`, `bookingStep`, `passengerForm`.
* **Persistence:** Uses `persist` middleware to preserve the user's booking step and search query so they can resume their booking flow if the browser tab is closed.
* **Security & Privacy:** Configured with `partialize` to **exclude the sensitive `passengerForm` state (which contains passport numbers)** from local storage.

### 2. `useUserStore` (Auth & Session Cache)
Manages the active Supabase session and client caching:
* **State:** `session`, `cachedBookings`.
* **Persistence:** Uses `persist` with `partialize` to **persist only the auth session token**, excluding the cached bookings list to ensure users always fetch real-time booking details on login.

## 📱 Progressive Web App (PWA) Integration
SkyBook is fully configured as an installable Progressive Web App (PWA) using a custom service worker (`public/sw.js`):
* **App Manifest:** Dynamically generated using Next.js Metadata API at `app/manifest.ts`, configuring standalone display, color branding, and app icons.
* **App Icons:** Custom brand assets at `/public/icons/` including a modern SVG logo and 192x192/512x512 PNG assets.
* **Offline Fallback Page:** Static offline view at `/offline` that renders automatically when the browser loses network connection.
* **Caching Strategy:**
  * **Stale-While-Revalidate:** Applied to search queries and bookings pages (`/bookings`), caching server-rendered pages and RSC data chunks so user bookings are completely readable offline.
  * **Cache-First:** Applied to static JS/CSS bundles, fonts, and brand assets for instant subsequent page loads.
* **Install Banner:** A custom-styled `.glass-card` banner (`components/InstallPrompt.tsx`) that prompts first-time mobile or desktop visitors to install the app when the installation requirements are met, with full session dismissal control.

---

## 🔑 Test User Credentials
To test the live system, use the following pre-configured user credentials:
* **Email:** `test@skybook.dev`
* **Password:** `Test@12345`

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AVTAR-007/flight-management.git
cd flight-management
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials (see `.env.example` for details):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Build & Production Deployment

To run a production build locally:
```bash
npm run build
```

To deploy to Vercel:
```bash
npx vercel --prod
```
