# 313 - Arabic Trivia Platform

## Overview

313 is a comprehensive Arabic trivia platform featuring team-based Jeopardy-style gameplay, payment processing, and administrative management. The platform delivers an immersive quiz experience with Arabic RTL support, Firebase integration, and Stripe payment processing for Kuwaiti Dinar transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with custom gold theme matching official 313 logo
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: React Query (TanStack Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds
- **Configuration**: Environment variable management with client-side config validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **Authentication**: Passport.js with local strategy and Firebase Auth integration
- **Session Management**: Express-session with secure cookie configuration
- **API Design**: RESTful endpoints with consistent error handling
- **Configuration**: Modular configuration system with environment variables and JSON data files

### Data Storage Architecture
- **Primary Database**: Firebase Firestore (NoSQL document database)
- **Fallback Database**: PostgreSQL with Drizzle ORM (configured but optional)
- **Data Synchronization**: Configuration-based data seeding from JSON files
- **Schema**: Separate TypeScript schemas for Firebase and PostgreSQL compatibility
- **Content Management**: JSON configuration files for categories, questions, pricing, and app settings

### Configuration Management (New)
- **Environment Variables**: All sensitive data (API keys, secrets) stored in .env files
- **Static Data**: Categories, questions, game packages, and coupons in separate JSON files
- **Type Safety**: Typed configuration loaders with validation
- **Team Collaboration**: Easy content updates without code changes
- **Multi-Environment**: Development, staging, and production configuration support

## Key Components

### Authentication System
- **Local Authentication**: Email/password with bcrypt hashing
- **OAuth Integration**: Google Sign-In with Firebase Auth
- **Session Management**: Secure HTTP-only cookies with 24-hour expiration
- **Authorization**: Role-based access control (admin vs regular users)

### Game Engine
- **Game Types**: Team-based trivia with turn management
- **Question System**: 6 categories with Arabic names, 3 difficulty levels (Easy: 200pts, Medium: 400pts, Hard: 600pts)
- **Hint System**: Optional hints with usage tracking per team
- **Scoring**: Automatic point calculation based on difficulty level
- **Session Management**: Persistent game state with Firebase storage

### Payment Processing
- **Provider**: Stripe integration with KWD currency support
- **Packages**: 1 game (1.900 KWD), 5 games (7.900 KWD)
- **Coupons**: Percentage and fixed discount system
- **Game Management**: Automatic credit/debit system for purchases and game usage

### Admin Dashboard
- **User Management**: CRUD operations for user accounts and game credits
- **Content Management**: Question and category administration
- **Analytics**: Game statistics and user engagement metrics
- **System Management**: Coupon creation and game package configuration

## Data Flow

### User Registration/Login
1. User submits credentials via React form
2. Express server validates and processes authentication
3. Password hashed with bcrypt, user stored in Firebase
4. Session created and secure cookie set
5. User redirected to dashboard with updated auth state

### Game Session Flow
1. User selects game package and teams on setup page
2. Categories selected and game session created in Firebase
3. Questions fetched based on selected categories and difficulty
4. Game state managed in real-time with Firebase updates
5. Scoring calculated and stored per team action
6. Game completion triggers credit deduction and history update

### Payment Processing
1. User selects game package on checkout page
2. Coupon validation (if applicable) and discount calculation
3. Stripe payment intent created with KWD pricing
4. Payment confirmation triggers game credit addition
5. Purchase record stored in Firebase with transaction details

## External Dependencies

### Core Technologies
- **Firebase**: Authentication, Firestore database, real-time updates
- **Stripe**: Payment processing with KWD currency support
- **Google APIs**: OAuth authentication and user profile data

### Development Tools
- **Vite**: Development server and build optimization
- **TypeScript**: Type checking and development experience
- **ESBuild**: Fast JavaScript bundling for production

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent visual elements

### Configuration Dependencies (New)
- **dotenv**: Environment variable loading for development
- **fs/path**: File system operations for configuration loading
- **JSON Schema**: Configuration validation and type safety

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot reload via Vite
- **Production**: Node.js server with pre-built static assets
- **Environment Variables**: Firebase credentials, Stripe keys, session secrets

### Build Process
1. **Frontend Build**: Vite compiles React/TypeScript to optimized static files
2. **Backend Build**: ESBuild bundles Node.js server with external dependencies
3. **Asset Optimization**: CSS/JS minification and code splitting
4. **Type Checking**: TypeScript compilation verification

### Database Strategy
- **Primary**: Firebase Firestore with automatic initialization
- **Fallback**: PostgreSQL with Drizzle migrations (optional)
- **Data Seeding**: Automatic population of initial categories, questions, and admin user
- **Backup**: Firebase's built-in replication and backup systems

The platform is designed to be deployment-agnostic, supporting various Node.js hosting environments with minimal configuration requirements.

## Recent Updates (January 2025)

### Logo and Theme Update
- **Logo Integration**: Official 313 logo image added across all pages
- **Color Scheme**: Complete redesign from blue-gray to gold/yellow theme matching logo
- **Logo Features**: Gold gradient design with Arabic cultural elements including mosque silhouette
- **Theme Colors**: Primary gold (hsl(45, 90%, 50%)), dark backgrounds, cream accents
- **UI Consistency**: All buttons, cards, and components updated to match new gold theme

## Recent Refactoring (January 2025)

### Configuration System Overhaul
- **Environment Variables**: All hardcoded API keys and sensitive data moved to .env files
- **JSON Configuration**: Static data (categories, questions, pricing) separated into config/ directory
- **Modular Architecture**: Clean separation with config/, shared/, server/config/, and server/services/ directories
- **Type Safety**: Comprehensive TypeScript configuration management with validation
- **Team Collaboration**: Content can be updated by editing JSON files without code changes

### New Directory Structure
```
config/           # Static configuration files (categories, questions, pricing)
shared/config.ts  # Configuration management utilities
server/config/    # Server configuration modules (Firebase, database)
server/services/  # Business logic services (data loading)
client/src/lib/config.ts  # Client-side configuration management
```

### Benefits Achieved
- **Scalability**: Environment-based configuration for multiple deployments
- **Maintainability**: Content updates without touching application logic
- **Security**: No sensitive data in version control
- **Team-Friendly**: Easy onboarding with proper .env.example file
- **GitHub Ready**: Professional project structure for collaborative development