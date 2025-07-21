# 313 - Arabic Cultural Games Platform

A comprehensive Arabic trivia platform featuring team-based Jeopardy-style gameplay, user authentication with phone number validation, game management, and payment processing with Kuwaiti Dinar pricing.

## ✨ Features

### Game Experience
- **Team-based Trivia**: Jeopardy-style interface with 6 categories and 3 difficulty levels
- **Arabic RTL Support**: Full right-to-left layout with Arabic typography
- **Hint System**: Optional hints with usage tracking per team
- **Scoring System**: 200, 400, 600 points based on difficulty
- **Session Management**: Persistent game state with Firebase

### User Management
- **Phone Number Authentication**: Kuwait mobile number validation (+965)
- **Google OAuth Integration**: Firebase Auth with Google Sign-In
- **Game Credits System**: Purchase and automatic deduction
- **User Profiles**: Complete registration with phone verification

### Admin Dashboard
- **Content Management**: Questions, categories, and pricing management
- **User Administration**: CRUD operations and credit management
- **Analytics**: Game statistics and user engagement metrics
- **Bulk Operations**: Question creation and content updates

### Payment Processing
- **Stripe Integration**: Secure payment processing
- **KWD Currency**: Kuwaiti Dinar pricing (1.900 KWD, 7.900 KWD packages)
- **Coupon System**: Percentage and fixed discount coupons
- **Transaction History**: Complete purchase records

## 🏗️ Architecture

### Modern Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript
- **Database**: Firebase Firestore (primary) + PostgreSQL (optional)
- **Authentication**: Passport.js + Firebase Auth
- **Payment**: Stripe with KWD support
- **Build**: Vite with ESBuild

### Configuration Management
- **Environment Variables**: All API keys and sensitive data
- **JSON Configuration**: Static data (categories, questions, pricing)
- **Modular Services**: Clean separation of concerns
- **Type Safety**: Comprehensive TypeScript throughout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase project with Firestore enabled
- Stripe account (optional for development)

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd 313-platform
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Firebase Configuration**
   - Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database and Authentication
   - Add Firebase config to `.env` file

4. **Start Development**
   ```bash
   npm run dev
   # Application available at http://localhost:5000
   ```

## 📁 Project Structure

```
├── config/                    # Static configuration files
│   ├── categories.json        # Game categories with Arabic names
│   ├── questions.json         # Quiz questions by category/difficulty
│   ├── game-packages.json     # Pricing packages in KWD
│   ├── coupons.json          # Discount coupons
│   └── admin-user.json       # Default admin configuration
│
├── shared/                    # Shared utilities and schemas
│   ├── config.ts             # Configuration management
│   ├── schema.ts             # Database schemas (PostgreSQL)
│   └── firebase-schema.ts    # Firebase document schemas
│
├── server/                    # Backend application
│   ├── config/               # Server configuration modules
│   │   ├── firebase.ts       # Firebase initialization
│   │   └── database.ts       # PostgreSQL configuration
│   ├── services/             # Business logic services
│   │   └── data-loader.ts    # Configuration-based data seeding
│   ├── routes.ts             # API endpoints
│   ├── firebase-storage.ts   # Firebase operations
│   └── index.ts              # Server entry point
│
├── client/                   # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── lib/             # Client utilities
│   │   │   ├── config.ts    # Client configuration
│   │   │   └── firebase.ts  # Firebase client setup
│   │   └── hooks/           # Custom React hooks
│   └── index.html
│
├── REFACTORING-GUIDE.md      # Architecture transformation guide
├── TEAM-SETUP-GUIDE.md       # Developer onboarding guide
└── API_DOCUMENTATION.md      # Complete API reference
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push PostgreSQL schema changes
```

### Content Management

**Adding Questions**
Edit `config/questions.json`:
```json
{
  "question": "سؤال جديد؟",
  "answer": "الإجابة الصحيحة",
  "category": "history",
  "difficulty": "متوسط",
  "hint": "تلميح مفيد",
  "explanation": "شرح الإجابة",
  "isPublished": true
}
```

**Adding Categories**
Edit `config/categories.json`:
```json
{
  "name": "unique_id",
  "displayName": "الاسم العربي",
  "description": "وصف الفئة",
  "isActive": true
}
```

**Updating Pricing**
Edit `config/game-packages.json`:
```json
{
  "name": "اسم الباقة",
  "gameCount": 5,
  "priceInCents": 790,
  "priceDisplay": "7.900 د.ك",
  "isActive": true
}
```

### Environment Variables

**Required for Firebase**
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Optional for Development**
```bash
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
DATABASE_URL=postgresql://...
SESSION_SECRET=random_string
```

## 🔧 Configuration

### Firebase Setup

1. **Create Project**: [Firebase Console](https://console.firebase.google.com/)
2. **Enable Services**:
   - Firestore Database
   - Authentication (Email/Password + Google)
3. **Get Configuration**: Project Settings → General → SDK setup
4. **Add to Environment**: Copy values to `.env` file

### Stripe Setup (Optional)

1. **Get API Keys**: [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. **Add to Environment**: `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`
3. **Configure Webhooks**: For production payment confirmation

## 📱 Features in Detail

### Game Flow
1. **Team Setup**: Create 2 teams with custom names
2. **Category Selection**: Choose 6 from available categories
3. **Question Grid**: Jeopardy-style 6×3 grid (Easy/Medium/Hard)
4. **Hint System**: Optional hints with tracking
5. **Scoring**: Automatic point calculation and team management
6. **Game Completion**: Credit deduction and session history

### Admin Features
- **User Management**: View, edit, delete users + credit adjustment
- **Question Bank**: Create, edit, publish/unpublish questions
- **Category Management**: Add/edit categories with Arabic display names
- **Coupon System**: Create discount codes with usage limits
- **Analytics Dashboard**: User statistics and revenue tracking
- **Data Management**: Reseed from configuration files

### Security
- **Session Management**: Secure HTTP-only cookies
- **Input Validation**: Zod schemas for all API endpoints
- **Phone Verification**: Kuwait number format validation
- **Admin Protection**: Role-based access control
- **Environment Isolation**: No sensitive data in code

## 🚀 Deployment

### Environment Setup
Set production environment variables:
```bash
NODE_ENV=production
VITE_FIREBASE_API_KEY=prod_key
STRIPE_SECRET_KEY=sk_live_...
SESSION_SECRET=secure_random_string
```

### Build Process
```bash
npm run build
# Outputs to dist/ directory
# Serve with any Node.js hosting service
```

### Database Deployment
- **Firebase**: Automatic scaling and global distribution
- **PostgreSQL**: Optional for complex queries (configure DATABASE_URL)

## 🤝 Team Collaboration

### Content Updates
- **Non-technical**: Edit JSON files in `config/` directory
- **Questions**: Add to `config/questions.json`
- **Pricing**: Update `config/game-packages.json`
- **Categories**: Modify `config/categories.json`

### Development Workflow
1. **Clone**: Get repository access
2. **Configure**: Add personal `.env` file
3. **Develop**: Edit code + test locally
4. **Content**: Update JSON files as needed
5. **Deploy**: Merge to main branch

### Documentation
- **Setup Guide**: `TEAM-SETUP-GUIDE.md`
- **Architecture**: `REFACTORING-GUIDE.md`
- **API Reference**: `API_DOCUMENTATION.md`

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical support or questions:
- Review documentation in project directory
- Check configuration files for content updates
- Verify environment variables are properly set
- Test with development Firebase project first