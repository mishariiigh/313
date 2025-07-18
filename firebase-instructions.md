# Firebase Setup Instructions

## Step 1: Configure Firebase Security Rules

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project "game-aad88"
3. Navigate to "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the existing rules with this configuration:

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

6. Click "Publish" to save the rules

## Step 2: Add Authorized Domains for Google Authentication

1. In your Firebase Console, go to "Authentication"
2. Click on the "Settings" tab
3. Scroll to "Authorized domains"
4. Add these domains:
   - `localhost` (for local development)
   - Your Replit domain (something like `abc123-def456.replit.app`)
   - Any custom domain you're using

## Step 3: Enable Google Sign-In

1. In Firebase Console, go to "Authentication"
2. Click on the "Sign-in method" tab
3. Find "Google" and click on it
4. Enable Google sign-in
5. Set your project's public-facing name (e.g., "313")
6. Set your support email
7. Click "Save"

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