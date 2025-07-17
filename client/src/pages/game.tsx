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

  if (!user) {
    return null;
  }

  // Since we only support team games now, redirect to team game component
  return <TeamGamePage params={params} />;
}