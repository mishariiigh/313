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
          <Route path="/admin/dashboard" component={AdminDashboard} />
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
      <AuthProvider>
        <React.Suspense fallback={<div>Loading...</div>}>
          <AppContent />
        </React.Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}