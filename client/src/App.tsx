import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import ArabicLayout from "@/components/ui/arabic-layout";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import GamePage from "@/pages/game";
import GameSetupPage from "@/pages/game-setup";
import AdminPage from "@/pages/admin";
import CheckoutPage from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/game-setup" component={GameSetupPage} />
      <Route path="/game/:id" component={GamePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ArabicLayout>
            <Toaster />
            <Router />
          </ArabicLayout>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
