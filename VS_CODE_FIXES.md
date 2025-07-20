# VS Code Server Errors - Solutions Guide

## Common Issues & Solutions

### 1. TypeScript Import Errors

**Problem**: "Cannot find module" errors for server imports
**Solution**: 
```bash
# Install TypeScript globally
npm install -g typescript
npm install -g tsx

# Install missing type definitions
npm install --save-dev @types/node @types/express @types/bcryptjs @types/passport @types/passport-local
```

### 2. Path Resolution Issues

**Problem**: VS Code can't resolve `@shared` imports
**Solution**: Ensure your `tsconfig.json` includes proper path mapping:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./shared/*"]
    }
  }
}
```

### 3. Firebase SDK Errors

**Problem**: Firebase import/initialization errors
**Solutions**:
```bash
# Reinstall Firebase dependencies
npm uninstall firebase firebase-admin
npm install firebase firebase-admin

# Check Firebase config
# Ensure .env file has correct Firebase credentials:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Express Session Errors

**Problem**: Session/authentication middleware errors
**Solution**:
```bash
# Install missing session dependencies
npm install express-session connect-pg-simple memorystore
npm install --save-dev @types/express-session
```

### 5. Database Connection Issues

**Problem**: PostgreSQL/Drizzle errors
**Solutions**:
```bash
# Option 1: Use Firebase only (recommended)
# Comment out PostgreSQL imports in server files

# Option 2: Install PostgreSQL dependencies
npm install pg @neondatabase/serverless drizzle-orm
npm install --save-dev @types/pg
```

### 6. Environment Variables

**Problem**: `process.env` variables undefined
**Solution**: Create `.env` file in root directory:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_database_url_optional
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
SESSION_SECRET=your_random_session_secret
```

### 7. VS Code Workspace Settings

**Problem**: VS Code not recognizing TypeScript config
**Solution**: Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "eslint.workingDirectories": ["./server", "./client"],
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

## Quick Fix Commands

Run these commands in your project root:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Install all server dependencies
npm install express passport passport-local bcryptjs express-session
npm install firebase firebase-admin ws
npm install --save-dev @types/express @types/passport @types/passport-local @types/bcryptjs @types/express-session @types/node @types/ws

# 3. Install TypeScript tools
npm install --save-dev typescript tsx

# 4. Reload VS Code TypeScript service
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

## Specific Server File Fixes

### Fix server/index.ts imports:
```typescript
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js"; // Add .js extension
import { setupVite, serveStatic, log } from "./vite.js"; // Add .js extension
```

### Fix server/routes.ts imports:
```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
// Ensure all relative imports have .js extension for proper resolution
```

### Fix Firebase imports:
```typescript
// Use proper Firebase v9+ syntax
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
```

## VS Code Extensions

Install these helpful extensions:
- TypeScript Importer
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Firebase

## Restart Steps

1. Close VS Code
2. Run: `npm install`
3. Restart VS Code
4. Press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
5. Press `Ctrl+Shift+P` → "Developer: Reload Window"

## Still Having Issues?

Check these specific error patterns:

1. **"Cannot find module 'firebase/app'"** → Run `npm install firebase`
2. **"Property 'env' does not exist on type 'ImportMeta'"** → Add `/// <reference types="vite/client" />` to file top
3. **"Module not found: Error: Can't resolve '@shared'"** → Check tsconfig.json paths
4. **"Cannot assign to 'json' because it is a read-only property"** → Check Express types version

Let me know the specific error messages you're seeing for more targeted help!