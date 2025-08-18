import React from "react";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import AuthPage from "./pages/auth";
import Dashboard from "./pages/dashboard";
import Game from "./pages/game";
import TeamGame from "./pages/team-game";
import GameSetup from "./pages/game-setup";
import Admin from "./pages/admin";
import AdminDashboard from "./pages/admin-dashboard";
import Checkout from "./pages/checkout";
import NotFound from "./pages/not-found";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./lib/auth";
import ArabicLayout from "./components/ui/arabic-layout";
import { queryClient } from "./lib/queryClient";
import "./index.css";

// Error boundary component to catch auth errors
class AuthErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Auth Error Boundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Auth Error details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ArabicLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في التحميل</h1>
              <p className="text-gray-600 mb-4">حدث خطأ أثناء تحميل التطبيق</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                إعادة تحميل الصفحة
              </button>
            </div>
          </div>
        </ArabicLayout>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  return (
    <ArabicLayout>
      <div>
        <Switch>
          <Route path="/" component={AuthPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/game/:id" component={Game} />
          <Route path="/team-game/:id" component={TeamGame} />
          <Route path="/game-setup" component={GameSetup} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </ArabicLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthErrorBoundary>
        <AuthProvider>
          <React.Suspense fallback={
            <ArabicLayout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">جارٍ التحميل...</p>
                </div>
              </div>
            </ArabicLayout>
          }>
            <AppContent />
          </React.Suspense>
        </AuthProvider>
      </AuthErrorBoundary>
    </QueryClientProvider>
  );
}