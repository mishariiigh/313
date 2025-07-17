import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Lightbulb, Eye, ArrowLeft, Home, Trophy } from "lucide-react";
import { getCategoryColor, getDifficultyColor } from "@/lib/game";

// Import the team game component
import TeamGamePage from "./team-game";

interface GamePageProps {
  params: {
    id: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Redirect if not logged in
  if (!user) {
    setLocation("/auth");
    return null;
  }

  const gameId = parseInt(params.id);

  const { data: gameData, isLoading } = useQuery({
    queryKey: ["/api/games", gameId],
    refetchOnWindowFocus: false,
  });

  // If this is a team game, use the team game component
  if (gameData?.gameSession?.gameType === "team") {
    return <TeamGamePage params={params} />;
  }

  // If this is a team game, use the team game component
  if (gameData?.gameSession?.gameType === "team") {
    return <TeamGamePage params={params} />;
  }

  const nextQuestionMutation = useMutation({
    mutationFn: async (answered: boolean) => {
      const response = await apiRequest("POST", `/api/games/${gameId}/next`, { answered });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.completed) {
        // Game completed, show completion screen
        queryClient.invalidateQueries({ queryKey: ["/api/games", gameId] });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      } else {
        // Next question
        queryClient.setQueryData(["/api/games", gameId], data);
        setShowHint(false);
        setShowAnswer(false);
      }
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleExitGame = () => {
    setLocation("/dashboard");
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextQuestion = (answered: boolean) => {
    nextQuestionMutation.mutate(answered);
  };

  const handleReturnToDashboard = () => {
    setLocation("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-card p-8 text-center">
          <div className="luxury-spinner mx-auto mb-4" />
          <p className="text-luxury-green-dark text-lg">جاري تحميل اللعبة...</p>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-card p-10 text-center">
          <div className="w-20 h-20 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="text-white h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-luxury-green-dark mb-6">لم يتم العثور على اللعبة</h2>
          <button className="luxury-button" onClick={handleReturnToDashboard}>
            <Home className="ml-2 h-5 w-5" />
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const { gameSession, currentQuestion, completed } = gameData;

  if (completed || gameSession.isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="luxury-card p-12 text-center max-w-md w-full">
          <div className="w-32 h-32 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-8 floating glow">
            <Trophy className="text-white h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-6">تم إكمال اللعبة!</h2>
          <p className="text-muted-foreground mb-8 text-lg">لقد أجبت على جميع الأسئلة بنجاح</p>
          
          {/* Final Score */}
          <div className="luxury-card p-8 mb-8 bg-luxury-green-light">
            <h3 className="text-xl font-bold text-luxury-green-dark mb-4">النتيجة النهائية</h3>
            <p className="text-5xl font-bold text-luxury-green mb-2">{gameSession.score}/36</p>
            <p className="text-luxury-green-dark font-medium">
              نسبة النجاح: {Math.round((gameSession.score / 36) * 100)}%
            </p>
          </div>

          <button className="luxury-button w-full text-lg py-4" onClick={handleReturnToDashboard}>
            <Home className="ml-2 h-6 w-6" />
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const progress = ((gameSession.currentQuestionIndex + 1) / gameSession.totalQuestions) * 100;

  return (
    <div className="min-h-screen">
      {/* Game Header */}
      <header className="luxury-card mx-4 mt-4 p-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-reverse space-x-4">
              <button className="luxury-button-secondary p-2" onClick={handleExitGame}>
                <ArrowRight className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-luxury-green-dark">جلسة اللعبة</h1>
                <p className="text-muted-foreground">
                  السؤال {gameSession.currentQuestionIndex + 1} من {gameSession.totalQuestions}
                </p>
              </div>
            </div>
            <div className="text-center">
              <span className="text-sm text-muted-foreground block">النقاط</span>
              <p className="font-bold text-luxury-green text-xl">{gameSession.score}/{gameSession.currentQuestionIndex + 1}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="game-progress-bar">
            <div className="game-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="question-card">
          {/* Category Badge */}
          <div className="flex items-center mb-6">
            <span className="luxury-badge bg-luxury-green-light text-luxury-green-dark px-4 py-2 rounded-full font-medium">
              {currentQuestion.category}
            </span>
            <span className="luxury-badge bg-luxury-gold text-white px-4 py-2 rounded-full font-medium mr-3">
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-luxury-green-dark leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {/* Hint Button */}
            {!showHint && currentQuestion.hint && (
              <button 
                className="luxury-button-secondary py-4 text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-white"
                onClick={handleShowHint}
              >
                <Lightbulb className="ml-2 h-5 w-5" />
                عرض التلميح
              </button>
            )}

            {/* Reveal Answer Button */}
            {!showAnswer && (
              <button 
                className="luxury-button py-4"
                onClick={handleRevealAnswer}
              >
                <Eye className="ml-2 h-5 w-5" />
                كشف الإجابة
              </button>
            )}

            {/* Next Question Button */}
            {showAnswer && (
              <button 
                className="luxury-button py-4 bg-luxury-green hover:bg-luxury-green/90"
                onClick={() => handleNextQuestion(true)}
                disabled={nextQuestionMutation.isPending}
              >
                {nextQuestionMutation.isPending ? (
                  <div className="luxury-spinner mx-auto" />
                ) : (
                  <>
                    <ArrowLeft className="ml-2 h-5 w-5" />
                    السؤال التالي
                  </>
                )}
              </button>
            )}
          </div>

          {/* Hint Display */}
          {showHint && currentQuestion.hint && (
            <div className="hint-section">
              <div className="flex items-start space-x-reverse space-x-3">
                <div className="flex-shrink-0">
                  <Lightbulb className="text-luxury-gold h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-luxury-green-dark mb-2">التلميح:</h4>
                  <p className="text-luxury-green-dark">{currentQuestion.hint}</p>
                </div>
              </div>
            </div>
          )}

          {/* Answer Display */}
          {showAnswer && (
            <div className="answer-section">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-luxury-green rounded-full flex items-center justify-center mx-auto mb-4 floating">
                  <Trophy className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-luxury-green-dark mb-2">الإجابة الصحيحة</h3>
                <p className="text-2xl font-bold text-luxury-green">
                  {currentQuestion.answer}
                </p>
              </div>
              
              {/* Explanation */}
              {currentQuestion.explanation && (
                <div className="luxury-card p-4 mt-4">
                  <h4 className="font-medium text-luxury-green-dark mb-2">شرح الإجابة:</h4>
                  <p className="text-luxury-green-dark leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Next Question Buttons */}
          {showAnswer && (
            <div className="flex space-x-reverse space-x-4">
              <button 
                className="luxury-button-secondary flex-1 py-4"
                onClick={() => handleNextQuestion(false)}
                disabled={nextQuestionMutation.isPending}
              >
                إجابة خاطئة
              </button>
              <button 
                className="luxury-button flex-1 py-4"
                onClick={() => handleNextQuestion(true)}
                disabled={nextQuestionMutation.isPending}
              >
                <ArrowLeft className="ml-2 h-4 w-4" />
                إجابة صحيحة
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
