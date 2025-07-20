# macOS Server Fix: ENOTSUP Error Resolved

## 🚨 Problem Identified
Your Mac was throwing `Error: listen ENOTSUP: operation not supported on socket 0.0.0.0:5000` because:
- macOS doesn't support binding to `0.0.0.0` (all interfaces) in some configurations
- Node.js server was trying to bind to all network interfaces instead of localhost

## ✅ Solution Applied

### Updated server/index.ts:
- **Development**: Server now binds to `localhost` on macOS
- **Production**: Still uses `0.0.0.0` for proper deployment
- **Removed**: `reusePort: true` option that can cause issues on macOS

### Changes Made:
```javascript
// Before (causing error)
server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
});

// After (macOS compatible)  
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
server.listen({
  port,
  host,
});
```

## 🚀 Test Your Fix

Run this on your Mac:
```bash
npm run dev
```

You should now see:
```
✅ Firebase collections already populated
serving on localhost:5000
```

## 🌐 Access Your Application

Open your browser to:
- **Development**: http://localhost:5000
- **Your Local Network**: Server is accessible only on localhost for security

## 🔧 Why This Happens on macOS

- macOS has stricter network security policies
- `0.0.0.0` binding requires elevated permissions in some cases
- `localhost` binding is always safe and sufficient for development

The 313 Arabic trivia platform will now start properly on your Mac without network binding errors!