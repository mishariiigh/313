# Arabic Trivia Game Platform

## Recent Changes: Latest modifications with dates

- **January 18, 2025**: Fixed team scoring system to ensure consistent points across all categories
  - Fixed question ordering by difficulty: questions are now retrieved in proper order (سهل, متوسط, صعب)
  - Updated getQuestionsByCategory to order questions by difficulty instead of random
  - Fixed frontend scoring calculation to use correct position-based scoring
  - All categories now consistently award 200, 400, 600 points based on difficulty level
  - Positions 0-1: سهل (easy) = 200 points, Positions 2-3: متوسط (medium) = 400 points, Positions 4-5: صعب (hard) = 600 points
  - Updated team scoring buttons to display correct points for each question
  - Fixed question key generation to properly map between Arabic category names and English IDs
- **January 18, 2025**: Fixed critical game creation and UI issues
  - Fixed category mapping issue between English category names in database and Arabic question categories
  - Game creation now properly maps English category names (history, culture, etc.) to Arabic category display names (التاريخ, الثقافة العامة, etc.)
  - Limited category selection to maximum 6 categories with proper validation and user feedback
  - Updated game setup UI to clearly show "يجب اختيار 6 فئات بالضبط" (must select exactly 6 categories)
  - Fixed "continue game" button to only show for active incomplete games, not completed ones
  - Added proper category selection limit with toast notification when exceeding 6 categories
  - Game creation now successfully works with proper category validation and question retrieval
  - Updated UI text to be clearer about category selection requirements
- **January 18, 2025**: Implemented mandatory game startup requirements and dynamic categories
  - Added mandatory selection of all required categories before game start
  - Implemented dynamic category system using admin-managed database categories
  - Added mandatory team name input validation
  - Updated game setup UI with category selection checkboxes showing admin-created categories
  - Added real-time validation feedback showing requirements status
  - Enhanced backend validation for categories and team names using database categories
  - Start game button now disabled until all requirements are met
  - Added visual indicators for completed/incomplete requirements
  - Categories now pull from admin dashboard instead of hardcoded values
  - System adapts to any number of active categories (minimum 6 required for games)
  - Updated team game board to use dynamic categories with proper Jeopardy-style scoring
  - Implemented correct point values: 200, 400, 600 based on question difficulty
  - Questions show checkmarks when completed and become unselectable
  - Game automatically completes when all questions are answered
  - Winner announcement screen shows final scores and congratulates winning team
  - Flexible grid layout adapts to any number of active categories from admin dashboard
- **January 17, 2025**: Major system updates and bug fixes
  - Fixed React hooks error that caused game crashes
  - Fixed questions not opening by removing incorrect points parameter
  - Added game completion screen with winner announcement
  - Implemented Jeopardy-style game board layout with horizontal categories
  - Made layout compact to fit on screen without scrolling
  - Added automatic game completion when all 36 questions are used
  - Changed entire website color scheme to off-white and light red theme
  - Updated all components, buttons, and layouts to use the new colors
  - Shows final scores and congratulates winning team
  - Expanded question database to 172 questions (28+ per category)
  - Fixed "insufficient questions" error that prevented game creation
  - Updated website background to lightest shadow red for better visual appeal
  - Enhanced header design with creative gradients, animations, and decorative elements
  - Redesigned statistics cards with unique color schemes and real data display
  - Added progress bars, achievement stars, and score animations to stats cards
  - Improved data accuracy for completed games and total score calculations
  - Implemented team-based hint system: each team gets to use hint once per entire game
  - Added teamHintsUsed field to track which teams have used their game hint
  - Enhanced hint button UI to show team hint status and prevent reuse
  - Teams can view previously used hints but cannot use new ones after consuming their allowance
  - Added 60-second countdown timer for each question with visual effects
  - Timer turns red and beats when 10 seconds remain, shows "time out" message at 0
  - Timer automatically starts when question is selected and stops when answered
  - Made existing questions fully editable in admin dashboard with comprehensive editing interface
  - Added edit/cancel buttons to question forms with proper state management
  - All question changes reflect immediately in game sections through proper cache invalidation
  - Enhanced admin dashboard with complete search and filter functionality for all content types
  - Added complete game packages management system for admin control over pricing
  - Created game packages database table with name, description, game count, and pricing
  - Updated checkout system to use dynamic game packages instead of fixed options
  - Added game packages admin interface for creating, editing, and managing packages
  - Created default game packages: المبتدئين (1 game, $1.99), المحترفين (5 games, $8.99), الخبراء (10 games, $14.99), الأسرة (20 games, $24.99)

## Overview

This is a modern web application for playing Arabic trivia games, built with React (TypeScript) on the frontend and Express.js on the backend. The platform supports team-based trivia games with two customizable teams, featuring animated transitions, luxury design aesthetics, and comprehensive game management through a dashboard.

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