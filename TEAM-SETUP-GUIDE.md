# 313 Platform - Team Setup Guide

## Quick Start for New Team Members

### 1. Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd 313-platform

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### 2. Environment Configuration

Edit `.env` file with your specific values:

```bash
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id  
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Payment Integration (Optional for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Database (Optional - Firebase is primary)
DATABASE_URL=postgresql://username:password@host:port/database

# Session Security (Auto-generated if not provided)
SESSION_SECRET=your_random_session_secret
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or get access to existing project
3. Enable Firestore Database and Authentication
4. Get configuration values from Project Settings
5. Add values to your `.env` file

### 4. Start Development

```bash
# Start the development server
npm run dev

# Application will be available at:
# http://localhost:5000
```

## Content Management

### Adding Questions

Edit `config/questions.json`:
```json
{
  "question": "سؤال جديد؟",
  "answer": "الإجابة الصحيحة",
  "category": "history",
  "difficulty": "متوسط",
  "hint": "تلميح للمساعدة",
  "explanation": "شرح تفصيلي للإجابة",
  "isPublished": true
}
```

**Requirements:**
- Each category needs exactly 6 questions
- 2 Easy (سهل) = 200 points each
- 2 Medium (متوسط) = 400 points each  
- 2 Hard (صعب) = 600 points each
- All questions must have hints
- Explanation is optional but recommended

### Adding Categories

Edit `config/categories.json`:
```json
{
  "name": "unique_category_id",
  "displayName": "الاسم المعروض",
  "description": "وصف الفئة",
  "isActive": true
}
```

### Updating Pricing

Edit `config/game-packages.json`:
```json
{
  "name": "اسم الباقة",
  "description": "وصف الباقة",
  "gameCount": 5,
  "priceInCents": 790,
  "priceDisplay": "7.900 د.ك",
  "sortOrder": 1,
  "isActive": true
}
```

### Managing Coupons

Edit `config/coupons.json`:
```json
{
  "code": "WELCOME10",
  "discountType": "percentage",
  "discountValue": 10,
  "maxUsage": 100,
  "usageCount": 0,
  "daysFromNow": 30,
  "isActive": true
}
```

## Development Workflow

### Making Changes

1. **Code Changes**: Edit TypeScript/React files as needed
2. **Content Changes**: Update JSON configuration files
3. **Environment Changes**: Update `.env` for your environment

### Testing

```bash
# Run the application
npm run dev

# Test different user scenarios:
# - Registration with phone number
# - Game creation and play
# - Admin dashboard functionality
# - Payment flow (if Stripe configured)
```

### Database Operations

```bash
# Push schema changes (if using PostgreSQL)
npm run db:push

# Note: Firebase is the primary database
# PostgreSQL is optional fallback
```

## Project Structure

```
├── config/                    # ✏️ EDIT THESE for content changes
│   ├── categories.json        # Game categories
│   ├── questions.json         # Quiz questions  
│   ├── game-packages.json     # Pricing packages
│   ├── coupons.json          # Discount coupons
│   ├── app-settings.json     # App configuration
│   └── admin-user.json       # Default admin user
│
├── shared/                    # 🔧 Shared utilities
│   ├── config.ts             # Configuration management
│   └── schema.ts             # Database schemas
│
├── server/                    # ⚙️ Backend code
│   ├── config/               # Server configuration
│   ├── services/             # Business logic
│   └── routes.ts             # API endpoints
│
└── client/                   # 🎨 Frontend code
    ├── src/components/       # UI components
    ├── src/pages/           # Application pages
    └── src/lib/             # Client utilities
```

## Common Tasks

### Add New Question Category

1. Edit `config/categories.json` - add new category
2. Edit `config/questions.json` - add 6 questions for the category
3. Restart server to apply changes

### Update Game Pricing

1. Edit `config/game-packages.json`
2. Update `priceInCents` (1 KWD = 100 cents)
3. Update `priceDisplay` with Arabic formatting
4. Changes apply immediately

### Create Promotional Coupon

1. Edit `config/coupons.json`
2. Add new coupon with unique code
3. Set discount type: "percentage" or "fixed"
4. Set expiration in `daysFromNow`

### Modify App Settings

1. Edit `config/app-settings.json`
2. Update feature flags, theme colors, or game rules
3. Restart server for changes to take effect

## Troubleshooting

### Environment Issues

```bash
# Check if environment variables are loaded
npm run dev

# Look for warnings about missing variables
# Update .env file accordingly
```

### Firebase Connection Issues

1. Verify Firebase project settings
2. Check API key permissions
3. Ensure Firestore is enabled
4. Verify environment variables

### Configuration Errors

1. Validate JSON syntax in config files
2. Check TypeScript errors in console
3. Verify required fields are present
4. Restart server after config changes

## Deployment

### Environment Variables

Set these in your deployment platform:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `STRIPE_SECRET_KEY` (production)
- `SESSION_SECRET` (random string)

### Build Process

```bash
# Build for production
npm run build

# Files are generated in dist/
# Serve with any Node.js hosting service
```

## Getting Help

### Configuration Issues
- Check `.env.example` for required variables
- Verify JSON syntax in config files
- Check console for detailed error messages

### Development Issues
- Review `REFACTORING-GUIDE.md` for architecture details
- Check TypeScript errors in IDE
- Use browser developer tools for client-side issues

### Content Updates
- Follow exact JSON structure in config files
- Validate Arabic text encoding
- Test changes in development before deploying

## Team Collaboration

### Version Control
- **Commit config files**: JSON files should be in version control
- **Don't commit .env**: Environment files are local only
- **Review changes**: Content changes are visible in git diff

### Content Review Process
1. Create feature branch for content changes
2. Update appropriate JSON config files
3. Test locally with `npm run dev`
4. Create pull request for review
5. Merge after approval

This refactored architecture enables smooth team collaboration while maintaining code quality and security standards.