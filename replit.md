# Arabic Trivia Game Platform

## Overview

This is a modern web application for playing Arabic trivia games, built with React (TypeScript) on the frontend and Express.js on the backend. The platform allows users to purchase game credits, play trivia games with Arabic questions across various categories, and manage their gaming experience through a comprehensive dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with Arabic RTL support
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Arabic Support**: Full RTL layout with Noto Sans Arabic fonts

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy and sessions
- **Password Security**: bcryptjs for hashing
- **Database Provider**: Neon serverless PostgreSQL
- **Session Storage**: Express sessions with PostgreSQL store

## Key Components

### Authentication System
- Session-based authentication using Passport.js
- Local strategy with email/password login
- Password hashing with bcryptjs
- User registration and login endpoints
- Protected routes middleware

### Game Engine
- Question-based trivia system with 36 questions per game
- Six categories: التاريخ (History), الجغرافيا (Geography), الدين (Religion), الرياضة (Sports), الثقافة العامة (General Culture), العلوم (Science)
- Three difficulty levels: سهل (Easy), متوسط (Medium), صعب (Hard)
- Questions include hints and explanations
- Game session tracking with progress persistence

### Payment System
- Stripe integration for game credit purchases
- Credit-based game access system
- Purchase history tracking
- Secure payment processing with payment intents

### Database Schema
- **Users**: Email, password, available games, admin status
- **Questions**: Question text, answer, category, difficulty, hints, explanations
- **Game Sessions**: User progress, question order, completion status
- **Purchases**: Payment records, game credits purchased

## Data Flow

1. **User Authentication**: Users register/login through the authentication system
2. **Game Purchase**: Users buy game credits through Stripe payment processing
3. **Game Creation**: System generates new game sessions with randomized questions
4. **Game Play**: Users progress through questions one by one with reveal mechanics
5. **Progress Tracking**: Game state is persisted in database sessions
6. **Completion**: Finished games are marked as completed and credits are consumed

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- UI Components (Radix UI primitives, shadcn/ui components)
- Styling (Tailwind CSS, class-variance-authority)
- Forms (React Hook Form, Zod validation)
- HTTP Client (TanStack Query for server state)
- Payment (Stripe React components)

### Backend Dependencies
- Express.js framework
- Database (Drizzle ORM, Neon PostgreSQL driver)
- Authentication (Passport.js, bcryptjs)
- Payment (Stripe Node.js SDK)
- Session management (express-session, connect-pg-simple)

### Development Tools
- TypeScript for type safety
- Vite for development server and building
- ESBuild for backend compilation
- Drizzle Kit for database migrations

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: ESBuild compiles TypeScript server to `dist/index.js`
- Database: Drizzle migrations handle schema changes

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `STRIPE_SECRET_KEY`: Stripe payment processing
- `VITE_STRIPE_PUBLIC_KEY`: Stripe public key for frontend

### Production Setup
- Node.js server serving both API and static files
- PostgreSQL database (Neon serverless)
- Session storage in PostgreSQL
- Stripe webhook handling for payment confirmation

The application follows a modern full-stack architecture with clear separation of concerns, secure authentication, and scalable database design optimized for Arabic language trivia gaming.