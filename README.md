# J&T Express Web App

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · React Router · i18next (AR/EN, RTL) · Firebase

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Firebase web-app config
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run lint` | Oxlint |
| `npm run emulators` | Firebase emulators (Auth, Firestore, Storage, Hosting) — needs `firebase-tools` |
| `npm run deploy` | Build and deploy to Firebase Hosting |

## Structure

```
src/
  app/            router and app-level wiring
  assets/brand/   mascot + official banner
  components/
    brand/        Logo, Mascot (interactive rabbit)
    layout/       RootLayout, LanguageSwitch
  features/       one folder per feature (components, hooks, firestore queries)
  i18n/           i18next setup + ar/en locale files
  lib/firebase.ts single Firebase init: auth, db (Firestore), storage
  pages/          route-level components
```

## Brand

Design tokens live in `src/index.css` under `@theme`: `brand-50…950` (primary `brand-600` = `#E51E25`),
`ink`, `cream`, `blush`, `denim`. Use `text-display` for the heavy italic J&T wordmark style (Latin only;
Arabic stays upright automatically).

## Firebase

Collections: `ticketCategories`, `financialInquiries`, `newOrderProcedures` (public read, admin write) and
`admins/{uid}` (admin flag). Anything else is denied. Storage is fully locked for now.

Deploy rules with `firebase deploy --only firestore:rules`.

### Admin dashboard (`/admin`)

1. Firebase console → Authentication → enable **Email/Password** and add the admin user.
2. Firestore → create document `admins/{that user's UID}` (any field, e.g. `name`).
3. Sign in at `/admin/login`.

Admins can add, edit, delete and drag-to-reorder content in every section. Arabic is required; English is optional per field.

### Local emulators

Requires **Java 21+**. Set `VITE_USE_FIREBASE_EMULATORS=true` with a `demo-*` project id in `.env.local`, then:

```bash
npm run emulators        # terminal 1
npm run seed:emulator    # terminal 2: creates a test admin + a non-admin user (see scripts/seed-emulator.mjs)
npm run dev
```
