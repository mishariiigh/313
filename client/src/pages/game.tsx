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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">لم يتم العثور على اللعبة</h2>
          <Button onClick={handleReturnToDashboard}>
            <Home className="ml-2 h-4 w-4" />
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const { gameSession, currentQuestion, completed } = gameData;

  if (completed || gameSession.isCompleted) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center p-8">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="text-white h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">تم إكمال اللعبة!</h2>
            <p className="text-neutral-600 mb-6">لقد أجبت على جميع الأسئلة بنجاح</p>
            
            {/* Final Score */}
            <div className="bg-neutral-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-2">النتيجة النهائية</h3>
              <p className="text-4xl font-bold text-secondary">{gameSession.score}/36</p>
              <p className="text-sm text-neutral-600 mt-2">
                نسبة النجاح: {Math.round((gameSession.score / 36) * 100)}%
              </p>
            </div>

            <Button className="w-full" onClick={handleReturnToDashboard}>
              <Home className="ml-2 h-4 w-4" />
              العودة إلى الصفحة الرئيسية
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const progress = ((gameSession.currentQuestionIndex + 1) / gameSession.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Game Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-reverse space-x-4">
              <Button variant="ghost" size="sm" onClick={handleExitGame}>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-neutral-800">جلسة اللعبة</h1>
                <p className="text-sm text-neutral-600">
                  السؤال {gameSession.currentQuestionIndex + 1} من {gameSession.totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="text-left">
                <span className="text-sm text-neutral-500">النقاط</span>
                <p className="font-bold text-primary">{gameSession.score}/{gameSession.currentQuestionIndex + 1}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="pb-4">
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8">
            {/* Category Badge */}
            <div className="flex items-center mb-6">
              <Badge className={getCategoryColor(currentQuestion.category)}>
                {currentQuestion.category}
              </Badge>
              <Badge className={`mr-2 ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </Badge>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-800 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Hint Button */}
              {!showHint && currentQuestion.hint && (
                <Button 
                  variant="outline" 
                  className="w-full py-4 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                  onClick={handleShowHint}
                >
                  <Lightbulb className="ml-2 h-4 w-4" />
                  عرض التلميح
                </Button>
              )}

              {/* Hint Display */}
              {showHint && currentQuestion.hint && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-reverse space-x-3">
                    <div className="flex-shrink-0">
                      <Lightbulb className="text-yellow-500 h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">التلميح:</h4>
                      <p className="text-yellow-700">{currentQuestion.hint}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reveal Answer Button */}
              {!showAnswer && (
                <Button 
                  className="w-full py-4" 
                  onClick={handleRevealAnswer}
                >
                  <Eye className="ml-2 h-4 w-4" />
                  كشف الإجابة
                </Button>
              )}

              {/* Answer Display */}
              {showAnswer && (
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="text-white h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">الإجابة الصحيحة</h3>
                    <p className="text-2xl font-bold text-neutral-800">
                      {currentQuestion.answer}
                    </p>
                  </div>
                  
                  {/* Explanation */}
                  {currentQuestion.explanation && (
                    <div className="bg-white rounded-lg p-4 mt-4">
                      <h4 className="font-medium text-neutral-800 mb-2">شرح الإجابة:</h4>
                      <p className="text-neutral-700 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Next Question Buttons */}
              {showAnswer && (
                <div className="flex space-x-reverse space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 py-4"
                    onClick={() => handleNextQuestion(false)}
                    disabled={nextQuestionMutation.isPending}
                  >
                    إجابة خاطئة
                  </Button>
                  <Button 
                    className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700"
                    onClick={() => handleNextQuestion(true)}
                    disabled={nextQuestionMutation.isPending}
                  >
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    إجابة صحيحة
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
