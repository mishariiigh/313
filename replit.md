# Arabic Trivia Game Platform

## Recent Changes: Latest modifications with dates

- **January 18, 2025**: MAJOR DATABASE MIGRATION TO FIREBASE FIRESTORE - Transitioned from PostgreSQL to cloud-based NoSQL database
  - ✅ FIREBASE SETUP: Created Firebase configuration for both client and server with Google API key integration
  - ✅ NEW STORAGE LAYER: Implemented comprehensive Firebase storage class replacing PostgreSQL operations
  - ✅ CLOUD DATABASE: All data now stored in Firebase Firestore collections (users, questions, gameSessions, purchases, categories, coupons, gamePackages)
  - ✅ STRING ID SYSTEM: Migrated from integer IDs to Firebase document string IDs
  - ✅ REAL-TIME CAPABILITIES: Firebase provides real-time updates and scalable cloud infrastructure
  - ✅ FIREBASE SCHEMAS: Created new schema definitions compatible with Firestore document structure
  - ✅ AUTHENTICATION INTEGRATION: Updated authentication system to work with Firebase user management
  - Platform now runs on Google's Firebase infrastructure for better scalability and real-time features
- **January 18, 2025**: WEBSITE REBRANDING TO "313" COMPLETE - Updated all platform branding and titles
  - ✅ HTML PAGE TITLE: Updated to "313 - منصة الألعاب الثقافية العربية"
  - ✅ MAIN DASHBOARD: Changed primary header from "منصة الألعاب الثقافية" to "313"
  - ✅ ADMIN DASHBOARD: Updated to "لوحة تحكم المدير - 313"
  - ✅ AUTH PAGE: Updated login/register page title to "313"
  - ✅ GAME SETUP: Updated page header to "إعداد لعبة جديدة - 313"
  - ✅ CHECKOUT PAGE: Updated to "شراء ألعاب إضافية - 313"
  - ✅ CONSISTENT BRANDING: All major pages now display "313" as the primary brand name
  - Platform now has unified "313" branding across all user interfaces
- **January 18, 2025**: SALES ANALYTICS DASHBOARD COMPLETE - Implemented comprehensive business intelligence system
  - ✅ REVENUE ANALYTICS: Real-time tracking of total revenue, sales count, and average order value
  - ✅ MONTHLY REVENUE CHARTS: Interactive 12-month revenue visualization with hover effects
  - ✅ TOP GAME PACKAGES: Ranking of best-selling packages with sales counts and revenue
  - ✅ RECENT SALES TRACKING: Real-time view of last 10 sales with user details and coupon usage
  - ✅ VISUAL METRICS DASHBOARD: Color-coded cards with gradient backgrounds for key performance indicators
  - ✅ COMPREHENSIVE ANALYTICS API: Backend service delivering detailed sales insights and trends
  - ✅ ADMIN DASHBOARD INTEGRATION: New analytics tab as first tab in admin management interface
  - Admin now has complete visibility into platform performance and sales trends
- **January 18, 2025**: PUBLISHING SYSTEM COMPLETE - Implemented draft/published workflow for questions
  - ✅ DRAFT/PUBLISHED SYSTEM: Questions are saved as drafts by default, then published when ready
  - ✅ PUBLISHING CONTROLS: Admin can publish/unpublish all questions with dedicated buttons
  - ✅ GAMES USE PUBLISHED ONLY: Only published questions appear in user games
  - ✅ VISUAL STATUS INDICATORS: Questions show "منشور" (published) or "مسودة" (draft) badges
  - ✅ BACKEND VALIDATION: Games only retrieve published questions from database
  - ✅ ADMIN WORKFLOW: Admin fills all questions → publishes → users can see in games
  - Admin now has complete control over question release timing and content visibility
- **January 18, 2025**: ENHANCED QUESTION MANAGEMENT - Implemented structured question system with limits and validation
  - ✅ ENFORCED QUESTION STRUCTURE: Each category requires exactly 6 questions (2 easy=200pts, 2 medium=400pts, 2 hard=600pts)
  - ✅ MANDATORY HINT SYSTEM: All questions must include hints (required field)
  - ✅ OPTIONAL DESCRIPTIONS: Questions can include optional explanations/descriptions
  - ✅ IMAGE UPLOAD SUPPORT: Questions can include optional images via ImageUpload component
  - ✅ CATEGORY OVERVIEW DASHBOARD: Visual status display showing question counts per category and difficulty
  - ✅ REAL-TIME VALIDATION: Frontend and backend validation prevents exceeding 2 questions per difficulty level
  - ✅ COMPREHENSIVE ADMIN INTERFACE: Complete user management with create, edit, delete, and search functionality
  - ✅ SAFE OPERATIONS: Protected deletion and admin status management
  - Admin can now control exactly 6 questions per category with proper point distribution and required hints
- **January 18, 2025**: COMPLETE FIX - Resolved question key mismatch and point display issues
  - ✅ FIXED QUESTION KEY STORAGE: Now store questionKey directly with selectedQuestion to avoid recalculation errors
  - ✅ ELIMINATED QUESTION MISMATCH: Questions now grey out correctly after being answered
  - ✅ SIMPLIFIED ALL HANDLERS: handleTeamCorrect, handleSkipQuestion, handleUseHint now use stored questionKey
  - ✅ DYNAMIC POINT DISPLAY: Questions show actual points based on difficulty (سهل=200, متوسط=400, صعب=600)
  - ✅ FIXED QUESTION MODAL: Points display correctly in question modal and team buttons
  - ✅ ADDED getPointsForDifficulty HELPER: Function maps Arabic difficulty levels to point values
  - ✅ MAINTAINED CATEGORY MAPPING: UI continues to use Arabic display names while backend uses English names
  - Root cause was complex position recalculation causing mismatched question keys between click and answer
  - Solution: Store questionKey directly with question to ensure consistency between UI and backend
- **January 18, 2025**: COMPLETE SOLUTION - Perfect scoring system fully implemented and verified
  - ✅ SCORING SYSTEM PERFECTED: 200-point questions give 200 points, 400-point questions give 400 points, 600-point questions give 600 points
  - ✅ Fixed category mapping: UI now uses English category names (history, geography, religion) for backend compatibility
  - ✅ Removed debug console logs as requested
  - ✅ Perfect question distribution: Each category has exactly 2 questions per difficulty level
  - ✅ Clean question keys: All use English format (history-0, geography-2, religion-4, etc.)
  - ✅ UI displays Arabic category names for user experience while backend uses English names
  - ✅ Comprehensive testing: Verified correct scoring (800+400 points) with position-based point awards
  - ✅ All categories working consistently with proper point structure
  - Final fix: Corrected category mapping in UI to use `name: cat.name` (English) instead of `name: cat.displayName` (Arabic)
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