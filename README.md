# 313 - Arabic Trivia Platform

An advanced Arabic trivia platform delivering an immersive, interactive quiz experience with comprehensive game management and user engagement.

## Features

- **Team-based Trivia Games** - Jeopardy-style gameplay with Arabic questions
- **User Authentication** - Email/password and Google OAuth support
- **Payment System** - Kuwaiti Dinar pricing with Stripe integration
- **Admin Dashboard** - Complete question and user management
- **Real-time Database** - Firebase Firestore integration
- **Responsive Design** - Arabic RTL layout with modern UI

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Passport.js + Firebase Auth
- **Payment**: Stripe
- **Build**: Vite

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase project
- Stripe account (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure Firebase (see setup-instructions.md)

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:

```
DATABASE_URL=your_postgres_url (optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
STRIPE_SECRET_KEY=your_stripe_secret_key (optional)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key (optional)
```

## Game Packages

- **1 Game**: 1.900 KWD
- **5 Games**: 7.900 KWD

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript types
└── docs/           # Documentation
```

## Contributing

This is a proprietary Arabic trivia platform. For questions, contact the development team.

## License

All rights reserved.