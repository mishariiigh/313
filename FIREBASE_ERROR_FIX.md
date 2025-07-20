# Firebase Error Fix: Invalid API Key

## 🚨 Error Analysis
You're getting `FirebaseError: Firebase: Error (auth/invalid-api-key)` because:
1. Your `.env` file is missing Firebase credentials
2. The Firebase API key is invalid or expired  
3. Environment variables aren't being loaded properly

## ✅ Quick Fix Steps

### Step 1: Check Your Environment File
```bash
cat .env
```

Your `.env` should look like this:
```env
VITE_FIREBASE_API_KEY=AIzaSy...your_actual_api_key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NODE_ENV=development
PORT=5000
```

### Step 2: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon → Project Settings
4. Scroll down to "Your apps" section
5. Click on your web app or create one
6. Copy these values:

```javascript
// Firebase config example
const firebaseConfig = {
  apiKey: "AIzaSy...",           // This is VITE_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com",
  projectId: "your-project-id",  // This is VITE_FIREBASE_PROJECT_ID
  storageBucket: "project.firebasestorage.app", 
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc"   // This is VITE_FIREBASE_APP_ID
};
```

### Step 3: Update Your .env File

Replace your `.env` content with:
```env
# Firebase Configuration (REQUIRED)
VITE_FIREBASE_API_KEY=AIzaSy_YOUR_ACTUAL_API_KEY_HERE
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_APP_ID=1:123456789:web:your_actual_app_id

# Optional (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_key_optional
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_optional

# Server Configuration  
NODE_ENV=development
PORT=5000
SESSION_SECRET=your_random_session_secret_here
```

### Step 4: Restart Development Server
```bash
npm run dev
```

You should see:
```
🔄 Checking Firebase collections...
✅ Firebase collections already populated
serving on port 5000
```

## 🔧 Firebase Project Setup (If You Need New Project)

If you don't have a Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" 
3. Enter project name: "313-arabic-trivia"
4. Enable Google Analytics (optional)
5. Click "Create project"
6. Once created, click "Add app" → Web (</>) icon
7. App nickname: "313 Trivia Web"
8. Copy the configuration values to your `.env`

## 🛠️ Enable Required Firebase Services

1. **Authentication**:
   - Go to Authentication → Get started
   - Sign-in method → Email/Password → Enable
   - (Optional) Google → Enable

2. **Firestore Database**:
   - Go to Firestore Database → Create database  
   - Start in test mode (for development)
   - Choose location closest to you

3. **Security Rules** (Important):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // For development only
       }
     }
   }
   ```

## 🎯 Test Your Fix

After updating `.env` with correct Firebase credentials:

```bash
npm run dev
```

Expected output:
```
✅ Firebase collections already populated
serving on port 5000
```

Then test:
1. Open http://localhost:5000
2. Try registering a new account
3. Try logging in
4. Should work without Firebase errors

## 🆘 Still Having Issues?

### Issue: "Project not found"
- Double-check your `VITE_FIREBASE_PROJECT_ID`
- Make sure the project exists in Firebase Console

### Issue: "Invalid API key"  
- Copy the API key exactly from Firebase Console
- Check for extra spaces or characters
- Make sure it starts with `AIzaSy`

### Issue: Environment variables not loading
```bash
# Check if .env file exists
ls -la .env

# Check content
cat .env

# Restart VS Code terminal
```

The 313 Arabic trivia platform will work perfectly once Firebase is properly configured!