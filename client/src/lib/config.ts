// Client-side configuration management
export const clientConfig = {
  // Firebase configuration from environment variables
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    authDomain: import.meta.env.VITE_FIREBASE_PROJECT_ID ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com` : undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_PROJECT_ID ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app` : undefined,
  },

  // Stripe configuration from environment variables
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  },

  // App configuration
  app: {
    name: "313",
    version: "1.0.0",
    description: "منصة الألعاب الثقافية العربية",
    tagline: "اختبر معلوماتك مع الأصدقاء والعائلة"
  },

  // Game configuration
  game: {
    maxTeams: 6,
    difficulties: ["سهل", "متوسط", "صعب"] as const,
    difficultyPoints: {
      "سهل": 200,
      "متوسط": 400,
      "صعب": 600
    } as const
  },

  // UI configuration
  ui: {
    rtl: true,
    defaultLanguage: "ar"
  },

  // Feature flags
  features: {
    googleAuth: true,
    phoneVerification: true,
    stripePayments: true,
    adminDashboard: true,
    analytics: true
  },

  // Validation
  validate() {
    const missingVars: string[] = [];

    if (!this.firebase.apiKey) missingVars.push('VITE_FIREBASE_API_KEY');
    if (!this.firebase.projectId) missingVars.push('VITE_FIREBASE_PROJECT_ID');
    if (!this.firebase.appId) missingVars.push('VITE_FIREBASE_APP_ID');

    if (missingVars.length > 0) {
      console.warn('Missing environment variables:', missingVars.join(', '));
      console.warn('Some features may not work properly. Check your .env file.');
    }

    return missingVars.length === 0;
  }
};

// Initialize validation on import
clientConfig.validate();