# SkillSync Frontend

A React + TypeScript + Tailwind CSS frontend for the SkillSync mentorship platform.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Redux Toolkit + React Query
- React Router DOM 7
- Google OAuth (@react-oauth/google)

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the Frontend directory:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── assets/          # Static assets (logos, images)
├── components/      # Reusable UI and layout components
│   ├── layout/      # Navbar, Sidebar, PageLayout, AuthLayout
│   ├── modals/      # Modal components
│   └── ui/          # Toast, ActionConfirm, ThemeToggleButton
├── context/         # React context providers (Theme)
├── hooks/           # Custom hooks
├── pages/           # Route-level page components
│   ├── admin/       # Admin dashboard pages
│   ├── auth/        # Login, Register, OTP, Password flows
│   ├── error/       # Error pages
│   ├── groups/      # Study groups
│   ├── learner/     # Learner dashboard
│   ├── mentor/      # Mentor dashboard
│   ├── mentors/     # Discover & detail pages
│   ├── notifications/
│   ├── payment/     # Checkout
│   ├── profile/     # User profile
│   ├── sessions/    # Session management
│   ├── settings/    # User settings
│   └── support/     # Help center
├── routes/          # App routing config
├── services/        # API client (axios)
├── store/           # Redux store & slices
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```
