# 313 Arabic Trivia Platform API Documentation

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: Your deployed domain

## Authentication
The API uses session-based authentication with cookies. Include credentials in all requests.

---

## Health Check

### GET /health
Check API server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T15:30:00.000Z"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Ahmed Ali"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "Ahmed Ali",
    "availableGames": 2,
    "isAdmin": false
  }
}
```

**Error Responses:**
- `400` - User already exists: `{"message": "المستخدم موجود بالفعل"}`
- `400` - Validation error: `{"message": "خطأ في إنشاء الحساب"}`

---

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "Ahmed Ali",
    "availableGames": 5,
    "isAdmin": false
  }
}
```

**Error Response:**
- `401` - Invalid credentials

---

### POST /api/auth/google
Authenticate using Google ID token.

**Request Body:**
```json
{
  "idToken": "google_id_token_here"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@gmail.com",
    "name": "Ahmed Ali",
    "availableGames": 2,
    "isAdmin": false
  }
}
```

---

### GET /api/auth/me
Get current authenticated user information.

**Success Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "Ahmed Ali",
    "availableGames": 5,
    "isAdmin": false
  }
}
```

**Error Response:**
- `401` - Not authenticated: `{"message": "غير مسجل الدخول"}`

---

### POST /api/auth/logout
Logout current user.

**Success Response (200):**
```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## Game Endpoints

### POST /api/games/start
Start a new trivia game.

**Request Body for Single Game:**
```json
{
  "gameType": "single"
}
```

**Request Body for Team Game:**
```json
{
  "gameType": "team",
  "teams": ["الفريق الأول", "الفريق الثاني"],
  "selectedCategories": ["history", "sports", "science", "literature", "geography", "culture"]
}
```

**Success Response (200):**
```json
{
  "gameSession": {
    "id": "game_123",
    "currentQuestionIndex": 0,
    "score": 0,
    "totalQuestions": 36,
    "gameType": "team",
    "teams": ["الفريق الأول", "الفريق الثاني"],
    "teamScores": [0, 0],
    "currentTurn": 0
  },
  "currentQuestion": null
}
```

**Error Responses:**
- `401` - Not authenticated
- `400` - No games available: `{"message": "لا توجد ألعاب متاحة"}`
- `400` - Invalid categories or teams

---

### GET /api/games/history
Get completed games history for current user.

**Success Response (200):**
```json
{
  "gameSessions": [
    {
      "id": "game_123",
      "score": 25,
      "totalQuestions": 36,
      "gameType": "single",
      "isCompleted": true,
      "completedAt": "2025-01-20T15:30:00.000Z"
    }
  ]
}
```

---

### GET /api/games/active
Get current active game session.

**Success Response (200):**
```json
{
  "activeSession": {
    "id": "game_123",
    "currentQuestionIndex": 5,
    "score": 3,
    "totalQuestions": 36,
    "gameType": "single",
    "isCompleted": false
  }
}
```

---

### GET /api/games/:id
Get specific game session details.

**Success Response for Team Game (200):**
```json
{
  "gameSession": {
    "id": "game_123",
    "currentQuestionIndex": 0,
    "score": 0,
    "totalQuestions": 36,
    "isCompleted": false,
    "gameType": "team",
    "teams": ["الفريق الأول", "الفريق الثاني"],
    "teamScores": [400, 200],
    "currentTurn": 1,
    "usedQuestions": ["history-0", "sports-1"],
    "usedHints": ["history-0"],
    "teamHintsUsed": [true, false],
    "selectedCategories": ["history", "sports", "science", "literature", "geography", "culture"]
  },
  "questions": [
    {
      "id": "q_123",
      "question": "متى تأسست دولة الكويت؟",
      "answer": "1961",
      "category": "history",
      "difficulty": "سهل",
      "hint": "في النصف الثاني من القرن العشرين",
      "explanation": "استقلت الكويت عن بريطانيا في عام 1961",
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
}
```

**Error Responses:**
- `404` - Game session not found
- `403` - Access denied

---

### POST /api/games/:id/complete
Mark game as completed.

**Success Response (200):**
```json
{
  "success": true
}
```

---

### POST /api/games/:id/team-correct
Record correct answer for team game.

**Request Body:**
```json
{
  "teamIndex": 0,
  "questionKey": "history-0"
}
```

**Success Response (200):**
```json
{
  "success": true
}
```

**Scoring System:**
- Questions 0-1: 200 points (Easy)
- Questions 2-3: 400 points (Medium)
- Questions 4-5: 600 points (Hard)

---

### POST /api/games/:id/skip-question
Skip a question without scoring.

**Request Body:**
```json
{
  "questionKey": "history-0"
}
```

---

### POST /api/games/:id/use-hint
Use hint for a question.

**Request Body:**
```json
{
  "questionKey": "history-0",
  "teamIndex": 0
}
```

**Note:** Each team can only use one hint per game.

---

### POST /api/games/:id/switch-turn
Switch to next team's turn.

**Success Response (200):**
```json
{
  "success": true
}
```

---

### POST /api/games/:id/adjust-score
Manually adjust team score.

**Request Body:**
```json
{
  "teamIndex": 0,
  "scoreChange": -200
}
```

---

### POST /api/games/:id/next
Move to next question (single game).

**Request Body:**
```json
{
  "answered": true
}
```

**Success Response (200):**
```json
{
  "gameSession": {
    "id": "game_123",
    "currentQuestionIndex": 2,
    "score": 1,
    "totalQuestions": 36,
    "isCompleted": false
  },
  "currentQuestion": {
    "id": "q_124",
    "question": "ما هي عاصمة الكويت؟",
    "answer": "مدينة الكويت",
    "category": "geography",
    "difficulty": "سهل",
    "hint": "نفس اسم البلد"
  }
}
```

---

## Payment Endpoints

### POST /api/create-payment-intent
Create Stripe payment intent.

**Request Body:**
```json
{
  "gameCount": 5,
  "couponCode": "DISCOUNT20"
}
```

**Success Response (200):**
```json
{
  "clientSecret": "pi_123_secret_abc",
  "amount": 790,
  "currency": "kwd",
  "discountAmount": 100,
  "finalAmount": 690
}
```

**Game Packages:**
- 1 Game: 1.900 KWD (190 fils)
- 5 Games: 7.900 KWD (790 fils)

---

### POST /api/confirm-payment
Confirm payment and add games to account.

**Request Body:**
```json
{
  "paymentIntentId": "pi_123",
  "gameCount": 5
}
```

---

### POST /api/validate-coupon
Validate coupon code.

**Request Body:**
```json
{
  "couponCode": "DISCOUNT20"
}
```

**Success Response (200):**
```json
{
  "valid": true,
  "discountType": "percentage",
  "discountValue": 20,
  "maxUsage": 100,
  "currentUsage": 25
}
```

---

## Public Data Endpoints

### GET /api/categories
Get available game categories.

**Success Response (200):**
```json
{
  "categories": [
    {
      "id": "cat_123",
      "name": "history",
      "displayName": "التاريخ",
      "description": "أسئلة عن التاريخ العربي والإسلامي",
      "isActive": true
    }
  ]
}
```

---

### GET /api/game-packages
Get available game packages for purchase.

**Success Response (200):**
```json
{
  "gamePackages": [
    {
      "id": "pkg_123",
      "name": "لعبة واحدة",
      "description": "لعبة تريفيا واحدة",
      "gameCount": 1,
      "price": 190,
      "priceDisplay": "1.900 د.ك",
      "sortOrder": 1,
      "isActive": true
    },
    {
      "id": "pkg_124",
      "name": "خمس ألعاب",
      "description": "خمس ألعاب تريفيا",
      "gameCount": 5,
      "price": 790,
      "priceDisplay": "7.900 د.ك",
      "sortOrder": 2,
      "isActive": true
    }
  ]
}
```

---

## Admin Endpoints
*All admin endpoints require authentication and admin privileges.*

### GET /api/admin/stats
Get platform statistics.

**Success Response (200):**
```json
{
  "totalUsers": 150,
  "totalGames": 500,
  "totalQuestions": 200,
  "totalRevenue": 15000,
  "activeUsers": 45
}
```

---

### GET /api/admin/sales-analytics
Get sales and revenue analytics.

**Success Response (200):**
```json
{
  "totalRevenue": 15000,
  "totalPurchases": 100,
  "averageOrderValue": 150,
  "topGamePackages": [
    {
      "name": "خمس ألعاب",
      "sales": 60,
      "revenue": 4740
    }
  ]
}
```

---

### GET /api/admin/questions
Get all questions for admin management.

### POST /api/admin/questions
Create new question.

**Request Body:**
```json
{
  "question": "متى تأسست دولة الكويت؟",
  "answer": "1961",
  "category": "history",
  "difficulty": "سهل",
  "hint": "في النصف الثاني من القرن العشرين",
  "explanation": "استقلت الكويت عن بريطانيا في عام 1961",
  "imageUrl": "https://example.com/image.jpg"
}
```

---

### PUT /api/admin/questions/:id
Update existing question.

### DELETE /api/admin/questions/:id
Delete question.

---

### GET /api/admin/categories
Get all categories for admin management.

### POST /api/admin/categories
Create new category.

### PUT /api/admin/categories/:id
Update category.

### DELETE /api/admin/categories/:id
Delete category.

---

### GET /api/admin/users
Get all users for admin management.

### POST /api/admin/users
Create new user.

### PUT /api/admin/users/:id
Update user details.

### DELETE /api/admin/users/:id
Delete user.

---

### GET /api/admin/coupons
Get all coupons.

### POST /api/admin/coupons
Create new coupon.

### PUT /api/admin/coupons/:id
Update coupon.

---

### GET /api/admin/game-packages
Get all game packages.

### POST /api/admin/game-packages
Create game package.

### PUT /api/admin/game-packages/:id
Update game package.

### DELETE /api/admin/game-packages/:id
Delete game package.

---

## Error Responses

All endpoints may return these common error responses:

- `401 Unauthorized`: `{"message": "غير مسجل الدخول"}`
- `403 Forbidden`: `{"message": "غير مصرح بالوصول"}`
- `404 Not Found`: `{"message": "المورد غير موجود"}`
- `500 Internal Server Error`: `{"message": "خطأ في الخادم"}`

---

## Rate Limiting
No rate limiting is currently implemented, but it's recommended for production use.

---

## Currency
All monetary amounts are in Kuwaiti Fils (1000 fils = 1 KWD):
- 190 fils = 1.900 KWD
- 790 fils = 7.900 KWD

---

## Data Models

### User
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "availableGames": "number",
  "isAdmin": "boolean",
  "createdAt": "timestamp"
}
```

### Question
```json
{
  "id": "string",
  "question": "string",
  "answer": "string",
  "category": "string",
  "difficulty": "سهل | متوسط | صعب",
  "hint": "string",
  "explanation": "string",
  "imageUrl": "string?",
  "isPublished": "boolean",
  "createdAt": "timestamp"
}
```

### Game Session
```json
{
  "id": "string",
  "userId": "string",
  "gameType": "single | team",
  "teams": "string[]",
  "questionIds": "string[]",
  "currentQuestionIndex": "number",
  "score": "number",
  "teamScores": "number[]",
  "currentTurn": "number",
  "usedQuestions": "string[]",
  "usedHints": "string[]",
  "teamHintsUsed": "boolean[]",
  "isCompleted": "boolean",
  "selectedCategories": "string[]",
  "createdAt": "timestamp"
}
```

---

## Environment Variables Required

- `SESSION_SECRET`: Session encryption key
- `GOOGLE_API_KEY`: Google authentication API key  
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `DATABASE_URL`: PostgreSQL database connection string

---

This API documentation covers all endpoints available in the 313 Arabic Trivia Platform. All Arabic text responses are in Arabic as shown in the examples.