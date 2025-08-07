import * as fs from 'fs';
import * as path from 'path';

// Environment configuration with validation
export const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    sessionSecret: process.env.SESSION_SECRET || 'fallback-secret-for-development-only',
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
  },

  // Firebase configuration
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    appId: process.env.FIREBASE_APP_ID,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },

  // Stripe configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publicKey: process.env.VITE_STRIPE_PUBLIC_KEY,
    priceId: process.env.STRIPE_PRICE_ID,
  },

  // Google API configuration
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
  },

  // Validate required environment variables
  validate() {
    const missingVars: string[] = [];

    if (!this.firebase.apiKey) missingVars.push('FIREBASE_API_KEY');
    if (!this.firebase.projectId) missingVars.push('FIREBASE_PROJECT_ID');
    if (!this.firebase.appId) missingVars.push('FIREBASE_APP_ID');

    if (missingVars.length > 0) {
      console.warn('Missing environment variables:', missingVars.join(', '));
      console.warn('Some features may not work properly. Check your .env file.');
    }

    return missingVars.length === 0;
  }
};

// Data loading utilities
export function loadJsonConfig<T>(fileName: string): T {
  try {
    const configPath = path.join(process.cwd(), 'config', fileName);
    const rawData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Failed to load config file: ${fileName}`, error);
    throw new Error(`Configuration file ${fileName} is required but not found or invalid`);
  }
}

// Typed configuration loaders
export const loadCategories = () => loadJsonConfig<Array<{
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
}>>('categories.json');

export const loadQuestions = () => loadJsonConfig<Array<{
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  hint: string;
  explanation: string;
  isPublished: boolean;
}>>('questions.json');

export const loadGamePackages = () => loadJsonConfig<Array<{
  name: string;
  description: string;
  gameCount: number;
  priceInCents: number;
  priceDisplay: string;
  sortOrder: number;
  isActive: boolean;
}>>('game-packages.json');

export const loadCoupons = () => loadJsonConfig<Array<{
  code: string;
  discountType: string;
  discountValue: number;
  maxUsage: number;
  usageCount: number;
  daysFromNow: number;
  isActive: boolean;
}>>('coupons.json');

export const loadAppSettings = () => loadJsonConfig<{
  app: {
    name: string;
    version: string;
    description: string;
    tagline: string;
  };
  game: {
    defaultFreeGames: number;
    maxTeams: number;
    maxQuestionsPerCategory: number;
    difficulties: string[];
    difficultyPoints: Record<string, number>;
  };
  ui: {
    theme: Record<string, string>;
    rtl: boolean;
    defaultLanguage: string;
  };
  features: Record<string, boolean>;
}>('app-settings.json');

export const loadAdminUser = () => loadJsonConfig<{
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  availableGames: number;
  isAdmin: boolean;
}>('admin-user.json');

// Initialize configuration validation on import (but don't throw errors)
try {
  config.validate();
} catch (error) {
  console.warn("Configuration validation failed:", error);
}