
// Client-side configuration management
export const clientConfig = {
  // Firebase configuration from environment variables
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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

  };
