# Arabic Trivia Game Platform

## Overview

This is a web-based Arabic trivia game platform that provides an engaging multiplayer trivia experience for Arabic-speaking users. The platform is built as a full-stack application with a React frontend and Express.js backend, featuring real-time game sessions, user authentication, payment processing, and comprehensive admin management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for development and production builds
- **Authentication**: Custom auth context with Firebase integration
- **Payment**: Stripe integration for payment processing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local and Firebase strategies
- **Session Management**: Express sessions with secure cookies
- **API Design**: RESTful API with structured error handling

### Database Architecture
- **Primary Database**: Firebase Firestore (NoSQL cloud database)
- **Schema**: Document-based collections for users, questions, game sessions, purchases, categories, coupons, and game packages
- **Migration Status**: Recently migrated from PostgreSQL to Firebase Firestore
- **Data Types**: String-based document IDs replacing integer primary keys

## Key Components

### Authentication System
- **Local Authentication**: Email/password with bcrypt hashing
- **Google OAuth**: Firebase Auth integration for Google sign-in
- **Session Management**: Server-side sessions with HTTP-only cookies
- **Authorization**: Role-based access control (admin/user roles)

### Game Engine
- **Game Types**: Team-based trivia games with multiple participants
- **Question System**: 6 categories with 3 difficulty levels (سهل/متوسط/صعب)
- **Scoring**: Points awarded based on difficulty (200/400/600 points)
- **Game Flow**: Turn-based gameplay with hint system and answer reveals

### Payment System
- **Payment Processor**: Stripe integration
- **Currency**: Kuwaiti Dinar (KWD) pricing
- **Packages**: 1 game (1.900 KWD), 5 games (7.900 KWD)
- **Coupon System**: Percentage and fixed-amount discount codes

### Admin Dashboard
- **Question Management**: CRUD operations for trivia questions
- **Category Management**: Custom categories with icons and descriptions
- **User Management**: User accounts and game credit management
- **Analytics**: Game statistics and usage tracking
- **Content Control**: Question publishing and moderation

## Data Flow

### User Registration/Login Flow
1. User submits credentials via React form
2. Frontend validates input using Zod schemas
3. Backend authenticates via Passport.js strategies
4. Session created and stored server-side
5. User data cached in React Query state

### Game Session Flow
1. User selects game type and categories
2. Backend generates questions from Firebase collections
3. Game session created with unique string ID
4. **AUTOMATIC DECREASE**: User's available games reduced by 1 when game starts
5. Real-time question display and scoring
6. Team scores updated in Firebase documents

### Payment Flow
1. User selects game package on frontend
2. Stripe payment intent created on backend (with coupon support)
3. Payment processed via Stripe Elements or mock for testing
4. **AUTOMATIC INCREASE**: User's available games increased by purchased amount
5. Purchase record stored in Firebase with coupon tracking
6. Coupon usage incremented if discount applied

### Data Synchronization
- **Auto-sync**: Automatic Firebase synchronization on server startup
- **Real-time Updates**: Firebase Firestore provides real-time capabilities
- **Fallback Storage**: Temporary storage layer as backup system

## External Dependencies

### Firebase Services
- **Firestore**: Primary database for all application data
- **Authentication**: Google OAuth and user management
- **Configuration**: Environment-based project configuration

### Stripe Payment Processing
- **API Integration**: Server-side payment intent creation
- **Frontend Elements**: Secure payment form components
- **Webhook Support**: Payment confirmation handling

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Comprehensive icon library
- **React Hook Form**: Form validation and handling
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **Drizzle**: Originally used for PostgreSQL (now deprecated)
- **ESBuild**: Production build optimization

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to static assets
- **Backend**: ESBuild bundles Express server for production
- **Assets**: Static files served from dist/public directory

### Environment Configuration
- **Development**: Local development with hot reload
- **Production**: Optimized builds with environment variables
- **Database**: Firebase project configuration via environment variables
- **Secrets**: Secure handling of API keys and session secrets

### Scalability Considerations
- **Firebase Firestore**: Auto-scaling NoSQL database
- **Stateless Backend**: Session-based but horizontally scalable
- **CDN Ready**: Static assets can be served from CDN
- **Real-time Capable**: Firebase provides real-time updates

### Security Measures
- **HTTPS**: Secure communication in production
- **CORS**: Configured for frontend-backend communication
- **Session Security**: HTTP-only cookies with secure flags
- **Input Validation**: Zod schemas for request validation
- **Firebase Rules**: Database security rules (needs configuration)

The platform is designed for deployment on cloud platforms with support for Node.js applications and can easily scale to handle multiple concurrent game sessions.