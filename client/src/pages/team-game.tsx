import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Users, Trophy, HelpCircle, Eye, Shuffle, Plus, Minus } from "lucide-react";
import { Question } from "@/../../shared/schema";

const CATEGORIES = [
  { id: "التاريخ", name: "التاريخ", icon: "📚" },
  { id: "الجغرافيا", name: "الجغرافيا", icon: "🌍" },
  { id: "الثقافة العامة", name: "الثقافة العامة", icon: "🧠" },
  { id: "الرياضة", name: "الرياضة", icon: "🏅" },
  { id: "الدين", name: "الدين", icon: "✨" },
  { id: "العلوم", name: "العلوم", icon: "🔬" },
];

interface TeamGamePageProps {
  params: {
    id: string;
  };
}

export default function TeamGamePage({ params }: TeamGamePageProps) {
  const id = params.id;
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Get game session data
  const { data: gameData, isLoading } = useQuery({
    queryKey: [`/api/games/${id}`],
    enabled: !!id,
  });

  // Questions are included in the game data for team games

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    if (gameData) {
      // Check if game is completed and auto-complete if needed
      if (gameData.gameSession?.usedQuestions?.length >= 36 && !gameData.gameSession?.isCompleted) {
        // Auto-complete the game
        apiRequest("POST", `/api/games/${id}/complete`).then(() => {
          queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
        });
      }
    }
  }, [user, gameData, setLocation, id]);

  // Mark team as correct
  const markTeamCorrectMutation = useMutation({
    mutationFn: async (data: { teamIndex: number; questionKey: string }) => {
      const response = await apiRequest("POST", `/api/games/${id}/team-correct`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
      setSelectedQuestion(null);
      setShowHint(false);
      setShowAnswer(false);
    },
  });

  // Skip question (no team got it right)
  const skipQuestionMutation = useMutation({
    mutationFn: async (data: { questionKey: string }) => {
      const response = await apiRequest("POST", `/api/games/${id}/skip-question`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
      setSelectedQuestion(null);
      setShowHint(false);
      setShowAnswer(false);
    },
  });

  // Use hint for a question
  const useHintMutation = useMutation({
    mutationFn: async (data: { questionKey: string }) => {
      const response = await apiRequest("POST", `/api/games/${id}/use-hint`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
      setShowHint(true);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في استخدام التلميح",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  // Switch team turn
  const switchTeamTurnMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/games/${id}/switch-turn`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
    },
  });

  // Adjust team score
  const adjustScoreMutation = useMutation({
    mutationFn: async (data: { teamIndex: number; scoreChange: number }) => {
      const response = await apiRequest("POST", `/api/games/${id}/adjust-score`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-spinner" />
      </div>
    );
  }

  if (!gameData?.gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-luxury-green-dark mb-4">جلسة اللعبة غير موجودة</h1>
          <Button onClick={() => setLocation("/dashboard")}>العودة للوحة التحكم</Button>
        </div>
      </div>
    );
  }

  const gameSession = gameData.gameSession;

  // Check if game is completed
  const isGameCompleted = gameSession.usedQuestions?.length >= 36; // 6 categories * 6 questions each
  
  // Calculate winner
  const getWinner = () => {
    if (!gameSession.teamScores || gameSession.teamScores.length < 2) return null;
    const maxScore = Math.max(...gameSession.teamScores);
    const winnerIndex = gameSession.teamScores.indexOf(maxScore);
    return {
      team: gameSession.teams[winnerIndex],
      score: maxScore,
      index: winnerIndex
    };
  };

  const handleQuestionClick = (category: string, index: number) => {
    // Check if question is already used
    const questionKey = `${category}-${index}`;
    if (gameSession.usedQuestions?.includes(questionKey)) {
      return;
    }

    // Find the question - questions are organized by category in groups of 6
    const categoryIndex = CATEGORIES.findIndex(cat => cat.id === category);
    const questionIndex = categoryIndex * 6 + index;
    const question = gameData?.questions?.[questionIndex];
    
    if (question) {
      setSelectedQuestion(question);
      // Check if hint was already used for this question
      const isHintUsed = gameSession.usedHints?.includes(questionKey);
      setShowHint(isHintUsed);
      setShowAnswer(false);
    }
  };

  const handleBackToBoard = () => {
    setSelectedQuestion(null);
    setShowHint(false);
    setShowAnswer(false);
  };

  const handleTeamCorrect = (teamIndex: number) => {
    if (!selectedQuestion) return;
    
    // Find which category and position this question is in
    const categoryIndex = CATEGORIES.findIndex(cat => cat.id === selectedQuestion.category);
    const questionIndex = gameData?.questions?.findIndex(q => q.id === selectedQuestion.id);
    
    if (categoryIndex !== -1 && questionIndex !== -1) {
      const positionInCategory = questionIndex - (categoryIndex * 6);
      const questionKey = `${selectedQuestion.category}-${positionInCategory}`;
      markTeamCorrectMutation.mutate({ teamIndex, questionKey });
    }
  };

  const handleSkipQuestion = () => {
    if (!selectedQuestion) return;
    
    // Find which category and position this question is in
    const categoryIndex = CATEGORIES.findIndex(cat => cat.id === selectedQuestion.category);
    const questionIndex = gameData?.questions?.findIndex(q => q.id === selectedQuestion.id);
    
    if (categoryIndex !== -1 && questionIndex !== -1) {
      const positionInCategory = questionIndex - (categoryIndex * 6);
      const questionKey = `${selectedQuestion.category}-${positionInCategory}`;
      skipQuestionMutation.mutate({ questionKey });
    }
  };

  const handleUseHint = () => {
    if (!selectedQuestion) return;
    
    // Find which category and position this question is in
    const categoryIndex = CATEGORIES.findIndex(cat => cat.id === selectedQuestion.category);
    const questionIndex = gameData?.questions?.findIndex(q => q.id === selectedQuestion.id);
    
    if (categoryIndex !== -1 && questionIndex !== -1) {
      const positionInCategory = questionIndex - (categoryIndex * 6);
      const questionKey = `${selectedQuestion.category}-${positionInCategory}`;
      useHintMutation.mutate({ questionKey });
    }
  };

  const getCurrentQuestionKey = () => {
    if (!selectedQuestion) return null;
    
    const categoryIndex = CATEGORIES.findIndex(cat => cat.id === selectedQuestion.category);
    const questionIndex = gameData?.questions?.findIndex(q => q.id === selectedQuestion.id);
    
    if (categoryIndex !== -1 && questionIndex !== -1) {
      const positionInCategory = questionIndex - (categoryIndex * 6);
      return `${selectedQuestion.category}-${positionInCategory}`;
    }
    return null;
  };

  // Game completion screen
  if (isGameCompleted) {
    const winner = getWinner();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50">
        <div className="max-w-2xl mx-auto p-8">
          <div className="luxury-card p-12 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              تهانينا! انتهت اللعبة
            </h1>
            
            {winner && (
              <div className="mb-8">
                <div className="text-2xl font-bold text-red-600 mb-4">
                  الفريق الفائز:
                </div>
                <div className="bg-gradient-to-r from-red-400 to-red-500 text-white p-6 rounded-xl text-3xl font-bold mb-4">
                  {winner.team}
                </div>
                <div className="text-xl text-gray-800">
                  النتيجة النهائية: {winner.score} نقطة
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">النتائج النهائية:</h3>
              <div className="space-y-3">
                {gameSession.teams.map((team: string, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-semibold">{team}</span>
                    <span className="text-red-600 font-bold text-lg">
                      {gameSession.teamScores[index] || 0} نقطة
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={() => setLocation("/dashboard")}
              className="bg-red-500 hover:bg-red-600 text-white text-lg py-4 px-8"
            >
              العودة للوحة التحكم
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Question view
  if (selectedQuestion) {
    return (
      <div className="min-h-screen p-4 page-transition">
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <div className="luxury-card p-8 mb-6 text-center question-slide-in">
            <div className="text-sm text-luxury-green mb-4">
              {selectedQuestion.category}
            </div>
            <div className="text-lg font-bold text-green-600 mb-4">
              {(() => {
                const categoryQuestions = gameData?.questions?.filter((q: Question) => q.category === selectedQuestion.category) || [];
                const questionIndex = categoryQuestions.findIndex(q => q.id === selectedQuestion.id);
                const points = questionIndex < 2 ? 200 : questionIndex < 4 ? 400 : 600;
                return `${points} نقطة`;
              })()}
            </div>
            <h1 className="text-3xl font-bold text-luxury-green-dark mb-8 question-card-flip">
              {selectedQuestion.question}
            </h1>
            
            <div className="flex justify-center gap-4 mb-8">
              {(() => {
                const currentQuestionKey = getCurrentQuestionKey();
                const isHintUsed = currentQuestionKey && gameSession.usedHints?.includes(currentQuestionKey);
                
                return (
                  <Button
                    onClick={() => {
                      if (showHint) {
                        setShowHint(false);
                      } else if (!isHintUsed) {
                        handleUseHint();
                      }
                    }}
                    variant="outline"
                    className={`luxury-button-secondary ${isHintUsed ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isHintUsed || useHintMutation.isPending}
                  >
                    <HelpCircle className="ml-2 h-4 w-4 text-luxury-green-dark" />
                    {isHintUsed ? "تم استخدام التلميح" : showHint ? "إخفاء التلميح" : "إظهار التلميح"}
                  </Button>
                );
              })()}
              
              <Button
                onClick={() => setShowAnswer(!showAnswer)}
                className="luxury-button"
              >
                <Eye className="ml-2 h-4 w-4 text-luxury-cream" />
                {showAnswer ? "إخفاء الإجابة" : "إظهار الإجابة"}
              </Button>
            </div>

            {(() => {
              const currentQuestionKey = getCurrentQuestionKey();
              const isHintUsed = currentQuestionKey && gameSession.usedHints?.includes(currentQuestionKey);
              
              return (showHint && isHintUsed && selectedQuestion.hint) ? (
                <div className="luxury-card p-4 mb-6 bg-blue-50 border-blue-200 hint-reveal">
                  <h3 className="font-semibold text-blue-800 mb-2">تلميح:</h3>
                  <p className="text-blue-700">{selectedQuestion.hint}</p>
                </div>
              ) : null;
            })()}

            {showAnswer && (
              <div className="luxury-card p-4 mb-6 bg-green-50 border-green-200 answer-reveal">
                <h3 className="font-semibold text-green-800 mb-2">الإجابة:</h3>
                <p className="text-green-700 text-xl font-bold">{selectedQuestion.answer}</p>
                {selectedQuestion.explanation && (
                  <p className="text-green-600 mt-2">{selectedQuestion.explanation}</p>
                )}
              </div>
            )}
          </div>

          {/* Team Selection */}
          <div className="luxury-card p-6 mb-6">
            <h3 className="text-xl font-bold text-luxury-green-dark mb-4 text-center">
              أي فريق أجاب بشكل صحيح؟
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {gameSession.teams.map((team: string, index: number) => {
                const categoryQuestions = gameData?.questions?.filter((q: Question) => q.category === selectedQuestion.category) || [];
                const questionIndex = categoryQuestions.findIndex(q => q.id === selectedQuestion.id);
                const points = questionIndex < 2 ? 200 : questionIndex < 4 ? 400 : 600;
                return (
                  <Button
                    key={index}
                    onClick={() => handleTeamCorrect(index)}
                    className="luxury-button py-4 text-lg"
                    disabled={markTeamCorrectMutation.isPending}
                  >
                    {team} ✅ (+{points})
                  </Button>
                );
              })}
            </div>
            
            <Button
              onClick={handleSkipQuestion}
              variant="outline"
              className="w-full luxury-button-secondary"
              disabled={skipQuestionMutation.isPending}
            >
              تخطي - لم يجب أي فريق بشكل صحيح
            </Button>
          </div>

          {/* Back to Board */}
          <div className="text-center">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleBackToBoard}
                variant="outline"
                className="luxury-button-secondary"
              >
                <ArrowLeft className="ml-2 h-4 w-4 text-luxury-green-dark" />
                العودة للوحة
              </Button>
              
              <Button
                onClick={async () => {
                  if (window.confirm("هل أنت متأكد من إنهاء اللعبة؟")) {
                    await apiRequest("POST", `/api/games/${id}/complete`);
                    setLocation("/dashboard");
                  }
                }}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                إنهاء اللعبة
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game board view - Jeopardy style layout
  return (
    <div className="min-h-screen flex flex-col page-transition bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Top navigation with scores */}
      <header className="bg-gradient-to-r from-red-300 to-red-400 text-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="bg-white/60 text-gray-800 border-gray-300 hover:bg-white/80 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <p className="text-sm opacity-90">
                دور: <span className="font-semibold bg-white/40 px-3 py-1 rounded-full">
                  {gameSession.teams[gameSession.currentTurn]}
                </span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchTeamTurnMutation.mutate()}
                disabled={switchTeamTurnMutation.isPending}
                className="bg-white/60 text-gray-800 border-gray-300 hover:bg-white/80 p-2"
                title="تبديل الدور"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Team Scores */}
          <div className="flex gap-4">
            {gameSession.teams.map((team: string, index: number) => (
              <div key={index} className="bg-white/60 rounded-lg p-3 text-center min-w-[140px] text-gray-800">
                <div className="text-sm font-semibold">{team}</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustScoreMutation.mutate({ teamIndex: index, scoreChange: -50 })}
                    disabled={adjustScoreMutation.isPending}
                    className="bg-white/80 text-gray-800 border-gray-300 hover:bg-white p-1 h-6 w-6"
                    title="تقليل النقاط"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="text-xl font-bold min-w-[40px]">
                    {gameSession.teamScores[index] || 0}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustScoreMutation.mutate({ teamIndex: index, scoreChange: 50 })}
                    disabled={adjustScoreMutation.isPending}
                    className="bg-white/80 text-gray-800 border-gray-300 hover:bg-white p-1 h-6 w-6"
                    title="زيادة النقاط"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Game Board - Jeopardy Grid */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-6 gap-3 h-full">
            {CATEGORIES.map((category, categoryIndex) => (
              <div key={category.id} className="flex flex-col">
                {/* Category Header with Icon */}
                <div className="bg-gradient-to-r from-red-200 to-red-300 text-gray-800 p-4 rounded-t-lg text-center min-h-[120px] flex flex-col items-center justify-center shadow-lg">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm font-bold">{category.name}</div>
                </div>
                
                {/* Question Buttons - Vertical Layout */}
                <div className="flex flex-col gap-2 mt-2">
                  {/* 200 Points */}
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1].map((index) => {
                      const questionKey = `${category.id}-${index}`;
                      const isUsed = gameSession.usedQuestions?.includes(questionKey);
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(category.id, index)}
                          disabled={isUsed}
                          className={`h-16 text-center font-bold text-lg transition-all duration-300 rounded-lg border-2 ${
                            isUsed
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          }`}
                        >
                          {isUsed ? (
                            <span className="text-xl">✓</span>
                          ) : (
                            <div className="font-bold text-lg">200</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* 400 Points */}
                  <div className="grid grid-cols-2 gap-2">
                    {[2, 3].map((index) => {
                      const questionKey = `${category.id}-${index}`;
                      const isUsed = gameSession.usedQuestions?.includes(questionKey);
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(category.id, index)}
                          disabled={isUsed}
                          className={`h-16 text-center font-bold text-lg transition-all duration-300 rounded-lg border-2 ${
                            isUsed
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          }`}
                        >
                          {isUsed ? (
                            <span className="text-xl">✓</span>
                          ) : (
                            <div className="font-bold text-lg">400</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* 600 Points */}
                  <div className="grid grid-cols-2 gap-2">
                    {[4, 5].map((index) => {
                      const questionKey = `${category.id}-${index}`;
                      const isUsed = gameSession.usedQuestions?.includes(questionKey);
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(category.id, index)}
                          disabled={isUsed}
                          className={`h-16 text-center font-bold text-lg transition-all duration-300 rounded-lg border-2 ${
                            isUsed
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          }`}
                        >
                          {isUsed ? (
                            <span className="text-xl">✓</span>
                          ) : (
                            <div className="font-bold text-lg">600</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}