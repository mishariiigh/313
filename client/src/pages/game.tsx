import React from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import TeamGamePage from "./team-game";

interface GamePageProps {
  params: {
    id: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  // Always render the team game component - it will handle auth checks internally
  return <TeamGamePage params={params} />;
}