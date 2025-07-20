# 313 Arabic Trivia Platform - Deployment Guide

## Prerequisites

- Node.js 20+ installed
- Firebase project configured
- (Optional) Stripe account for payments

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Configure your environment variables in `.env`:
   - Firebase credentials (required)
   - Stripe keys (optional)
   - Database URL (optional)

## Development

Start the development server:
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5000`

## Production Build

Build for production:
```bash
npm run build
npm run start
```

## Deployment Options

### Option 1: Platform Deployment (Recommended)
- Deploy to any Node.js hosting platform
- Set environment variables in platform settings
- Run `npm run build` and `npm run start`

### Option 2: Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start"]
```

### Option 3: Manual Server Deployment
1. Upload project files to server
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Start with PM2 or similar: `pm2 start npm --name "313-trivia" -- start`

## Database Setup

The application uses Firebase Firestore as the primary database. PostgreSQL is optional and only used as fallback.

### Firebase Configuration
1. Create Firebase project
2. Enable Authentication and Firestore
3. Update security rules (see setup-instructions.md)
4. Add your domain to authorized domains

## Important Notes

- Ensure all environment variables are set before deployment
- Firebase security rules must be configured properly
- For production, replace development security rules with proper authentication
- The application automatically creates required collections on first run

## Monitoring

Check logs for:
- Firebase connection status
- Authentication errors
- Payment processing (if enabled)
- Game session management

## Support

For technical issues, check:
1. Environment variable configuration
2. Firebase connection and rules
3. Network connectivity
4. Browser console for frontend errors