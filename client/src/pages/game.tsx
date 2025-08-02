import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Clock, Users, Brain } from "lucide-react";
import TeamGamePage from "./team-game";

interface GamePageProps {
  params: {
    id: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [gameSession, setGameSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    loadGameSession();
  }, [user, setLocation, params.id]);

  const loadGameSession = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("فشل في تحميل الجلسة");
      }

      const data = await response.json();
      setGameSession(data.gameSession);
      setCurrentQuestion(data.currentQuestion);
    } catch (error) {
      console.error("Error loading game session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              لم يتم العثور على الجلسة
            </p>
            <Button 
              onClick={() => setLocation("/dashboard")} 
              className="w-full mt-4"
            >
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If it's a team game, render the team game component
  if (gameSession.gameType === "team") {
    return <TeamGamePage params={params} />;
  }

  // Handle single player game
  const handleAnswer = async (correct: boolean) => {
    try {
      const response = await fetch(`/api/games/${params.id}/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answered: correct })
      });

      if (!response.ok) {
        throw new Error("فشل في الإجابة");
      }

      const data = await response.json();
      
      if (data.completed) {
        setGameSession({ ...gameSession, isCompleted: true });
      } else {
        setGameSession(data.gameSession);
        setCurrentQuestion(data.currentQuestion);
      }
    } catch (error) {
      console.error("Error answering question:", error);
    }
  };

  if (gameSession.isCompleted) {
    return (
      <div className="min-h-screen p-4" dir="rtl">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-yellow-500" />
                انتهت اللعبة!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg mb-2">النتيجة النهائية</p>
              <p className="text-3xl font-bold text-primary mb-4">
                {gameSession.score} من {gameSession.totalQuestions}
              </p>
              <Button 
                onClick={() => setLocation("/dashboard")} 
                className="w-full"
              >
                العودة للرئيسية
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Game Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <span className="font-medium">لعبة فردية</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>السؤال {gameSession.currentQuestionIndex + 1} من {gameSession.totalQuestions}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">النقاط</p>
              <p className="text-2xl font-bold text-primary">{gameSession.score}</p>
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{currentQuestion.category}</Badge>
                <Badge variant={
                  currentQuestion.difficulty === "سهل" ? "default" : 
                  currentQuestion.difficulty === "متوسط" ? "secondary" : "destructive"
                }>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
              
              <div className="space-y-3 mb-6">
                <Button
                  onClick={() => handleAnswer(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  إجابة صحيحة
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  إجابة خاطئة
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">الإجابة:</p>
                <p className="font-medium">{currentQuestion.answer}</p>
                {currentQuestion.explanation && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">التفسير:</p>
                    <p className="text-sm">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}