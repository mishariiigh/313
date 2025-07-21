# 313 Arabic Trivia Platform API Reference

## Base URL
```
http://localhost:5000
```

## Authentication

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "name": "User Name",
    "availableGames": 0,
    "isAdmin": false
  }
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "name": "User Name",
    "availableGames": 5,
    "isAdmin": false
  }
}
```

### GET /api/auth/me
Get current authenticated user information.

**Response (200):**
```json
{
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "name": "User Name",
    "availableGames": 5,
    "isAdmin": false
  }
}
```

### POST /api/auth/logout
Logout current user session.

**Response (200):**
```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

## Game Management

### GET /api/categories
Get all available game categories.

**Response (200):**
```json
{
  "categories": [
    {
      "id": "categoryId",
      "name": "التاريخ",
      "displayName": "التاريخ",
      "description": "أسئلة تاريخية",
      "logoUrl": "https://example.com/logo.png"
    }
  ]
}
```

### GET /api/game-packages
Get all available game packages with pricing.

**Response (200):**
```json
{
  "packages": [
    {
      "id": "packageId",
      "name": "لعبة واحدة",
      "description": "لعبة تريفيا واحدة",
      "gameCount": 1,
      "priceInCents": 1900,
      "sortOrder": 1,
      "isActive": true
    },
    {
      "id": "packageId2",
      "name": "5 ألعاب",
      "description": "خمس ألعاب تريفيا",
      "gameCount": 5,
      "priceInCents": 7900,
      "sortOrder": 2,
      "isActive": true
    }
  ]
}
```

### POST /api/games/start
Start a new single-player game.

**Request Body:**
```json
{
  "categories": ["التاريخ", "الجغرافيا", "العلوم"]
}
```

**Response (200):**
```json
{
  "gameSession": {
    "id": "sessionId",
    "userId": "userId",
    "gameType": "single",
    "questions": [...],
    "currentQuestionIndex": 0,
    "score": 0,
    "isComplete": false,
    "createdAt": "2025-01-21T16:00:00Z"
  }
}
```

### POST /api/games/team/start
Start a new team-based game.

**Request Body:**
```json
{
  "teamNames": ["الفريق الأحمر", "الفريق الأزرق"],
  "categories": ["التاريخ", "الجغرافيا", "العلوم", "الرياضة", "الثقافة العامة", "الدين"]
}
```

**Response (200):**
```json
{
  "gameSession": {
    "id": "sessionId",
    "userId": "userId",
    "gameType": "team",
    "teams": [
      {
        "name": "الفريق الأحمر",
        "score": 0,
        "hintsUsed": 0
      },
      {
        "name": "الفريق الأزرق",
        "score": 0,
        "hintsUsed": 0
      }
    ],
    "currentTeam": 0,
    "categories": [...],
    "isComplete": false,
    "createdAt": "2025-01-21T16:00:00Z"
  }
}
```

### POST /api/games/{sessionId}/answer
Submit an answer for a question.

**Request Body:**
```json
{
  "answer": "الإجابة المقدمة",
  "teamIndex": 0
}
```

**Response (200):**
```json
{
  "correct": true,
  "points": 400,
  "correctAnswer": "الإجابة الصحيحة",
  "explanation": "شرح الإجابة",
  "gameSession": {...}
}
```

### POST /api/games/{sessionId}/hint
Get a hint for the current question.

**Request Body:**
```json
{
  "teamIndex": 0
}
```

**Response (200):**
```json
{
  "hint": "تلميح مفيد للسؤال",
  "gameSession": {...}
}
```

### GET /api/games/history
Get user's game history.

**Response (200):**
```json
{
  "gameSessions": [
    {
      "id": "sessionId",
      "gameType": "single",
      "score": 2400,
      "totalQuestions": 36,
      "correctAnswers": 28,
      "isComplete": true,
      "completedAt": "2025-01-21T16:30:00Z"
    }
  ]
}
```

### GET /api/games/active
Get user's active game session.

**Response (200):**
```json
{
  "activeSession": {
    "id": "sessionId",
    "gameType": "team",
    "teams": [...],
    "currentTeam": 1,
    "categories": [...],
    "isComplete": false
  }
}
```

## Payment System

### POST /api/payment/create-intent
Create a Stripe payment intent.

**Request Body:**
```json
{
  "packageId": "packageId",
  "couponCode": "SAVE20"
}
```

**Response (200):**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 1520,
  "discount": {
    "code": "SAVE20",
    "type": "percentage",
    "value": 20,
    "discountAmount": 380
  }
}
```

### POST /api/payment/confirm
Confirm payment and add games to user account.

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "packageId": "packageId"
}
```

**Response (200):**
```json
{
  "success": true,
  "gamesAdded": 5,
  "newBalance": 8
}
```

### POST /api/coupons/validate
Validate a coupon code.

**Request Body:**
```json
{
  "code": "SAVE20",
  "amount": 1900
}
```

**Response (200):**
```json
{
  "valid": true,
  "discount": {
    "type": "percentage",
    "value": 20,
    "discountAmount": 380
  },
  "finalAmount": 1520
}
```

## Admin Endpoints

All admin endpoints require authentication and admin privileges.

### GET /api/admin/questions
Get all questions with filtering options.

**Query Parameters:**
- `category` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty

**Response (200):**
```json
{
  "questions": [
    {
      "id": "questionId",
      "question": "ما هي عاصمة الكويت؟",
      "answer": "الكويت",
      "category": "الجغرافيا",
      "difficulty": "سهل",
      "hint": "نفس اسم البلد",
      "explanation": "مدينة الكويت هي العاصمة",
      "imageUrl": "https://example.com/image.png",
      "published": true,
      "createdAt": "2025-01-21T16:00:00Z"
    }
  ]
}
```

### POST /api/admin/questions
Create a new question.

**Request Body:**
```json
{
  "question": "ما هي عاصمة الكويت؟",
  "answer": "الكويت",
  "category": "الجغرافيا",
  "difficulty": "سهل",
  "hint": "نفس اسم البلد",
  "explanation": "مدينة الكويت هي العاصمة",
  "imageUrl": "https://example.com/image.png"
}
```

**Response (201):**
```json
{
  "question": {
    "id": "questionId",
    "question": "ما هي عاصمة الكويت؟",
    "answer": "الكويت",
    "category": "الجغرافيا",
    "difficulty": "سهل",
    "hint": "نفس اسم البلد",
    "explanation": "مدينة الكويت هي العاصمة",
    "imageUrl": "https://example.com/image.png",
    "published": false,
    "createdAt": "2025-01-21T16:00:00Z"
  }
}
```

### PUT /api/admin/questions/{id}
Update an existing question.

**Request Body:**
```json
{
  "question": "ما هي عاصمة دولة الكويت؟",
  "answer": "مدينة الكويت",
  "hint": "تحمل نفس اسم البلد"
}
```

**Response (200):**
```json
{
  "question": {
    "id": "questionId",
    "question": "ما هي عاصمة دولة الكويت؟",
    "answer": "مدينة الكويت",
    "hint": "تحمل نفس اسم البلد",
    ...
  }
}
```

### DELETE /api/admin/questions/{id}
Delete a question.

**Response (200):**
```json
{
  "message": "تم حذف السؤال بنجاح"
}
```

### POST /api/admin/questions/publish
Publish all questions to make them available in games.

**Response (200):**
```json
{
  "message": "تم نشر جميع الأسئلة بنجاح",
  "publishedCount": 216
}
```

### GET /api/admin/categories
Get all categories for admin management.

**Response (200):**
```json
{
  "categories": [
    {
      "id": "categoryId",
      "name": "التاريخ",
      "displayName": "التاريخ",
      "description": "أسئلة تاريخية",
      "logoUrl": "https://example.com/logo.png"
    }
  ]
}
```

### POST /api/admin/categories
Create a new category.

**Request Body:**
```json
{
  "name": "الفن",
  "displayName": "الفن والأدب",
  "description": "أسئلة عن الفن والأدب",
  "logoUrl": "https://example.com/art-logo.png"
}
```

### GET /api/admin/coupons
Get all discount coupons.

**Response (200):**
```json
{
  "coupons": [
    {
      "id": "couponId",
      "code": "SAVE20",
      "discountType": "percentage",
      "discountValue": 20,
      "maxUsage": 100,
      "usageCount": 15,
      "isActive": true,
      "expiresAt": "2025-12-31T23:59:59Z",
      "createdAt": "2025-01-21T16:00:00Z"
    }
  ]
}
```

### POST /api/admin/coupons
Create a new coupon.

**Request Body:**
```json
{
  "code": "WELCOME30",
  "discountType": "percentage",
  "discountValue": 30,
  "maxUsage": 50,
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

### PUT /api/admin/coupons/{id}
Update coupon status (activate/deactivate).

**Request Body:**
```json
{
  "isActive": false
}
```

### GET /api/admin/users
Get all users for admin management.

**Response (200):**
```json
{
  "users": [
    {
      "id": "userId",
      "email": "user@example.com",
      "name": "User Name",
      "availableGames": 5,
      "totalGamesPlayed": 12,
      "isAdmin": false,
      "createdAt": "2025-01-21T16:00:00Z"
    }
  ]
}
```

### PUT /api/admin/users/{id}/games
Update user's available games count.

**Request Body:**
```json
{
  "availableGames": 10
}
```

### GET /api/admin/game-packages
Get all game packages for admin management.

**Response (200):**
```json
{
  "packages": [
    {
      "id": "packageId",
      "name": "لعبة واحدة",
      "description": "لعبة تريفيا واحدة",
      "gameCount": 1,
      "priceInCents": 1900,
      "sortOrder": 1,
      "isActive": true,
      "createdAt": "2025-01-21T16:00:00Z"
    }
  ]
}
```

### POST /api/admin/game-packages
Create a new game package.

**Request Body:**
```json
{
  "name": "باقة المحترفين",
  "description": "10 ألعاب للمحترفين",
  "gameCount": 10,
  "priceInCents": 15000,
  "sortOrder": 3,
  "isActive": true
}
```

### PUT /api/admin/game-packages/{id}
Update a game package.

**Request Body:**
```json
{
  "name": "باقة المحترفين المحدثة",
  "priceInCents": 14000,
  "isActive": true
}
```

### DELETE /api/admin/game-packages/{id}
Delete a game package.

**Response (200):**
```json
{
  "message": "تم حذف الباقة بنجاح"
}
```

### GET /api/admin/sales-analytics
Get sales and revenue analytics.

**Response (200):**
```json
{
  "totalRevenue": 25400,
  "totalSales": 18,
  "totalUsers": 45,
  "totalQuestions": 216,
  "recentSales": [
    {
      "userId": "userId",
      "userName": "User Name",
      "packageName": "5 ألعاب",
      "amount": 7900,
      "createdAt": "2025-01-21T16:00:00Z"
    }
  ],
  "packageSales": [
    {
      "packageName": "لعبة واحدة",
      "salesCount": 12,
      "totalRevenue": 22800
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "بيانات غير صحيحة",
  "errors": ["حقل الإيميل مطلوب"]
}
```

### 401 Unauthorized
```json
{
  "message": "غير مسجل الدخول"
}
```

### 403 Forbidden
```json
{
  "message": "غير مخول للوصول"
}
```

### 404 Not Found
```json
{
  "message": "المورد غير موجود"
}
```

### 500 Internal Server Error
```json
{
  "message": "خطأ في الخادم",
  "error": "Error details"
}
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Game endpoints: 60 requests per minute
- Admin endpoints: 100 requests per minute

## Webhooks

### Stripe Payment Webhook
**Endpoint:** `/api/webhooks/stripe`
**Method:** POST

Handles payment confirmation events from Stripe.

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  availableGames: number;
  totalGamesPlayed: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Question
```typescript
{
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "سهل" | "متوسط" | "صعب";
  hint: string;
  explanation?: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Game Session
```typescript
{
  id: string;
  userId: string;
  gameType: "single" | "team";
  teams?: Array<{
    name: string;
    score: number;
    hintsUsed: number;
  }>;
  currentTeam?: number;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  categories: string[];
  isComplete: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Game Package
```typescript
{
  id: string;
  name: string;
  description: string;
  gameCount: number;
  priceInCents: number; // Price in fils (1900 = 1.900 KWD)
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Coupon
```typescript
{
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUsage?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Currency Information

- All prices are stored in fils (smallest unit of Kuwaiti Dinar)
- 1 KWD = 1000 fils
- Example: 1.900 KWD = 1900 fils
- Display format: `{(priceInCents / 100).toFixed(3)} د.ك`

## Game Scoring System

- **Easy Questions (0-1):** 200 points each
- **Medium Questions (2-3):** 400 points each  
- **Hard Questions (4-5):** 600 points each
- **Team Mode:** Questions organized by category (6 questions per category)
- **Single Mode:** 36 random questions from selected categories

## Question Requirements

Each category requires exactly 6 questions:
- 2 Easy questions (200 points each)
- 2 Medium questions (400 points each)  
- 2 Hard questions (600 points each)

All questions require:
- Question text
- Correct answer
- Category assignment
- Difficulty level
- Hint (mandatory)
- Explanation (optional)
- Image (optional)