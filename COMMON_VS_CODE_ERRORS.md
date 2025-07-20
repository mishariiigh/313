# Common VS Code Server Errors - Quick Solutions

## 🚨 Most Likely Issues You're Seeing

### 1. Missing Dependencies Error
**Error**: `Cannot find module 'firebase' or '@shared/firebase-schema'`
**Quick Fix**:
```bash
npm install
```

### 2. TypeScript Path Resolution 
**Error**: `Cannot resolve module '@shared/*'`
**Fix**: Make sure VS Code is using the workspace TypeScript version:
- Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
- Type "TypeScript: Select TypeScript Version"
- Choose "Use Workspace Version"

### 3. Firebase SDK Issues
**Error**: `Module 'firebase/firestore' has no exported member...`
**Fix**: Install latest Firebase SDK:
```bash
npm install firebase@latest firebase-admin@latest
```

### 4. Environment Variables Missing
**Error**: `process.env.STRIPE_SECRET_KEY is undefined`
**Fix**: Create `.env` file in root:
```env
# Copy from .env.example and fill in your values
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key_optional
SESSION_SECRET=any_random_string_here
NODE_ENV=development
PORT=5000
```

### 5. Session/Passport Issues
**Error**: Express session types not found
**Fix**:
```bash
npm install express-session passport passport-local bcryptjs
npm install --save-dev @types/express-session @types/passport @types/passport-local @types/bcryptjs
```

## 🔧 Complete Fix Commands (Run These)

```bash
# Step 1: Clean install
rm -rf node_modules package-lock.json
npm install

# Step 2: Ensure all server dependencies
npm install express passport passport-local bcryptjs express-session firebase firebase-admin stripe zod ws tsx
npm install --save-dev @types/express @types/passport @types/passport-local @types/bcryptjs @types/express-session @types/node @types/ws

# Step 3: Create environment file
cp .env.example .env
# Edit .env with your Firebase credentials

# Step 4: Restart VS Code TypeScript
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

## 🎯 VS Code Specific Setup

Create `.vscode/settings.json` in project root:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "eslint.workingDirectories": ["./"],
  "files.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/.cache": true,
    "**/dist": true
  }
}
```

## 📝 Test Your Setup

After running the fixes, test by running:
```bash
npm run dev
```

You should see:
```
🔄 Checking Firebase collections...
✅ Firebase collections already populated  
serving on port 5000
```

## 🆘 Still Getting Errors?

Send me the specific error message you see in VS Code, and I'll provide a targeted solution. Common patterns:

- **Red squiggly lines under imports** → Dependency/path issue
- **"Cannot find module"** → Missing npm packages
- **"Type 'X' is not assignable to type 'Y'"** → TypeScript version mismatch
- **Firebase errors** → Wrong SDK version or missing config

The project is fully functional - these are usually just VS Code/TypeScript configuration issues!