# Firebase Setup Instructions

## ✅ Firebase Configuration Complete - Now Update Security Rules

Your Firebase project is connected! I can see your configuration:
- **Project ID**: game-aad88
- **API Key**: Connected ✅
- **App ID**: Connected ✅

## 🔧 CRITICAL: Update Firebase Security Rules

**You need to do this in the Firebase Console RIGHT NOW:**

1. Go to: https://console.firebase.google.com/project/game-aad88/firestore/rules
2. Replace the existing rules with this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for development
    // WARNING: This is for development only, tighten security for production
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish" to save the rules

## ⚠️ Current Status:
- Firebase connected but security rules blocking writes
- 36 questions ready to push (6 per category: التاريخ, الجغرافيا, الدين, الرياضة, الثقافة العامة, العلوم)
- All user data, game packages, and coupons ready
- Admin account ready: `mishariiigh@hotmail.com`

## 🔐 Enable Google Authentication (Optional)

**After fixing security rules above, do this for Google sign-in:**

1. Go to: https://console.firebase.google.com/project/game-aad88/authentication/settings
2. Add authorized domains:
   - Your Replit domain (copy from browser URL)
   - `localhost` (for testing)

3. Go to: https://console.firebase.google.com/project/game-aad88/authentication/providers
4. Click "Google" and enable it
5. Set project name: "313"
6. Click "Save"

## Step 4: Create Collections (Optional)

Once the security rules are set, the application will automatically create the following collections when data is first added:

- `users` - User accounts and profiles
- `categories` - Game categories (التاريخ, الجغرافيا, etc.)
- `questions` - Trivia questions with answers and hints
- `gameSessions` - Active and completed game sessions
- `gamePackages` - Available game packages for purchase
- `coupons` - Discount coupons
- `purchases` - Purchase history

## Step 5: Test the Setup

After completing these steps:
1. Try logging in with your admin account: `mishariiigh@hotmail.com` / `Seddiq123*`
2. Try the Google sign-in button
3. Check the Firebase Console to see if data is being created

## Important Notes

- The current security rules allow all read/write access for development
- For production, you should implement proper authentication-based security rules
- The Google sign-in will only work once the authorized domains are properly configured
- Make sure to replace the broad security rules with more restrictive ones before going live