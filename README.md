# ✈️ SkyBook — Premium Flight Management System

SkyBook is a state-of-the-art, high-fidelity flight booking and management system. Designed with a premium dark-themed aesthetic, fluid animations, and glassmorphic UI depth, SkyBook offers a seamless and responsive airline experience.

## 🚀 Live Deployment
* **Production URL:** [https://flight-management-murex.vercel.app](https://flight-management-murex.vercel.app)
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
* **State Management:** Zustand (Fast, client-side store)
* **Database:** Supabase Serverless Client & PostgreSQL
* **Icons:** Lucide React (Premium SVG vector iconography)

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
Create a `.env.local` file in the root directory and add your Supabase credentials:
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
