# VS Code Setup Guide for 313 Arabic Trivia Platform

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Step 2: Environment Configuration
```bash
cp .env.example .env
```
Edit `.env` and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### Step 3: VS Code Configuration
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "files.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/.cache": true
  }
}
```

### Step 4: Start Development Server
```bash
npm run dev
```

You should see:
```
🔄 Checking Firebase collections...
✅ Firebase collections already populated
serving on port 5000
```

## 🔧 VS Code Extensions (Optional)

Recommended extensions for better development experience:

- **TypeScript Importer** - Auto-import TypeScript modules
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Firebase** - Firebase integration
- **Thunder Client** - API testing (alternative to Postman)

## 🎯 Fixing Common VS Code Issues

### Issue: Red squiggly lines under imports
**Solution**: 
```bash
# In VS Code, press Ctrl+Shift+P
# Type: "TypeScript: Restart TS Server"
# Press Enter
```

### Issue: "Cannot find module '@shared/*'"
**Solution**: Check that `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

### Issue: TypeScript errors everywhere
**Solution**: Temporarily disable strict checking by updating `tsconfig.json`:
```json
{
  "compilerOptions": {
    "noImplicitAny": false,
    "strictNullChecks": false,
    "useUnknownInCatchVariables": false
  }
}
```

### Issue: Firebase import errors
**Solution**: 
```bash
npm install firebase@latest firebase-admin@latest
```

## 🖥️ Development Workflow

### 1. Start the Server
```bash
npm run dev
```

### 2. Access the Application
Open `http://localhost:5000`

### 3. Admin Login
- Email: `admin@313.com`
- Password: `admin123`

### 4. Test Features
- ✅ User registration/login
- ✅ Game creation and playing  
- ✅ Admin dashboard
- ✅ Payment system (with test mode)

## 📱 Testing the Application

### Frontend Testing
1. Open browser developer tools (F12)
2. Check Console tab for any errors
3. Test user registration/login
4. Create a new game session
5. Try the admin dashboard

### Backend Testing
1. Check terminal for server logs
2. Look for Firebase connection status
3. Monitor API requests in terminal
4. Check for any authentication issues

## 🚨 Troubleshooting

### Server Won't Start
```bash
# Check Node.js version
node --version  # Should be 18+

# Clean install
rm -rf node_modules package-lock.json
npm install

# Check environment
cat .env  # Verify Firebase credentials
```

### VS Code Performance Issues
```bash
# Disable some extensions temporarily
# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Firebase Connection Issues
1. Check Firebase credentials in `.env`
2. Verify Firebase project is active
3. Check Firebase console for any billing issues
4. Test with Firebase CLI: `npm install -g firebase-tools`

## 💡 Pro Tips

1. **Use Multiple Terminals**:
   - Terminal 1: `npm run dev` (server)
   - Terminal 2: For git commands, file operations

2. **VS Code Shortcuts**:
   - `Ctrl+Shift+P`: Command palette
   - `Ctrl+`` `: Toggle terminal
   - `Ctrl+Shift+E`: File explorer
   - `F5`: Start debugging

3. **Development Tips**:
   - Use browser dev tools for frontend debugging
   - Check server terminal for backend logs
   - Firebase console for database inspection
   - Network tab for API request monitoring

## ✅ Success Indicators

When everything is working correctly, you should see:

**Terminal Output**:
```
✅ Firebase collections already populated
serving on port 5000
```

**Browser Console**: No error messages

**Application Features**: All pages load, authentication works, games can be created

---

The 313 Arabic trivia platform is production-ready and fully functional. These VS Code setup instructions will help you work with it efficiently!