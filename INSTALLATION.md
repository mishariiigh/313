# 313 Arabic Trivia Platform - Installation Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open `http://localhost:5000` in your browser

## Detailed Setup

### Firebase Configuration (Required)

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication and Firestore Database
3. Get your Firebase config values:
   - API Key
   - Project ID  
   - App ID
4. Update `.env` with your Firebase credentials
5. Follow instructions in `setup-instructions.md` for security rules

### Stripe Configuration (Optional)

For payment processing:
1. Create Stripe account at https://stripe.com
2. Get your test API keys from Stripe Dashboard
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```

### Admin Account Setup

Default admin credentials:
- Email: `admin@313.com` 
- Password: `admin123`

Or create account through the registration form.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema (if using PostgreSQL)

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check Firebase credentials in `.env`
   - Verify Firebase project is active
   - Check security rules are configured

2. **Authentication Not Working**
   - Verify Firebase Auth is enabled
   - Check authorized domains in Firebase console
   - Ensure environment variables are loaded

3. **Payment Processing Issues**
   - Verify Stripe keys are correct
   - Check Stripe account is active
   - Test with Stripe test cards

### Development Tips

- Use browser developer tools to check console for errors
- Check server logs in terminal for backend issues
- Verify environment variables are loaded: `console.log(process.env)`
- Test Firebase connection in Firebase console

## Project Structure

```
313-arabic-trivia/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage
│   └── firebase-*.ts    # Firebase integrations
├── shared/              # Shared types
└── docs/                # Documentation
```

## Support

For issues:
1. Check this documentation
2. Review setup-instructions.md
3. Check Firebase and Stripe dashboards
4. Review browser console and server logs