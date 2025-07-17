import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Users, Trophy, HelpCircle, Eye } from "lucide-react";
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
  const [gameBoard, setGameBoard] = useState<{ [key: string]: boolean[] }>({});

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
      // Initialize game board based on used questions
      const board: { [key: string]: boolean[] } = {};
      CATEGORIES.forEach(category => {
        board[category.id] = [false, false, false, false, false, false];
      });

      // Mark used questions
      if (gameData.gameSession?.usedQuestions) {
        gameData.gameSession.usedQuestions.forEach((questionKey: string) => {
          const [category, index] = questionKey.split('-');
          if (board[category]) {
            board[category][parseInt(index)] = true;
          }
        });
      }

      setGameBoard(board);
    }
  }, [user, gameData, setLocation]);

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

  const handleQuestionClick = (category: string, index: number) => {
    // Check if question is already used
    const questionKey = `${category}-${index}`;
    if (gameSession.usedQuestions?.includes(questionKey)) {
      return;
    }

    // Find the question
    const categoryQuestions = gameData?.questions?.filter((q: Question) => q.category === category) || [];
    const question = categoryQuestions[index];
    
    if (question) {
      setSelectedQuestion(question);
      setShowHint(false);
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
    
    const categoryQuestions = gameData?.questions?.filter((q: Question) => q.category === selectedQuestion.category) || [];
    const questionIndex = categoryQuestions.findIndex(q => q.id === selectedQuestion.id);
    const questionKey = `${selectedQuestion.category}-${questionIndex}`;
    const points = questionIndex < 2 ? 200 : questionIndex < 4 ? 400 : 600;
    markTeamCorrectMutation.mutate({ teamIndex, questionKey, points });
  };

  const handleSkipQuestion = () => {
    if (!selectedQuestion) return;
    
    const categoryQuestions = gameData?.questions?.filter((q: Question) => q.category === selectedQuestion.category) || [];
    const questionIndex = categoryQuestions.findIndex(q => q.id === selectedQuestion.id);
    const questionKey = `${selectedQuestion.category}-${questionIndex}`;
    skipQuestionMutation.mutate({ questionKey });
  };

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
              <Button
                onClick={() => setShowHint(!showHint)}
                variant="outline"
                className="luxury-button-secondary"
              >
                <HelpCircle className="ml-2 h-4 w-4 text-luxury-green-dark" />
                {showHint ? "إخفاء التلميح" : "إظهار التلميح"}
              </Button>
              
              <Button
                onClick={() => setShowAnswer(!showAnswer)}
                className="luxury-button"
              >
                <Eye className="ml-2 h-4 w-4 text-luxury-cream" />
                {showAnswer ? "إخفاء الإجابة" : "إظهار الإجابة"}
              </Button>
            </div>

            {showHint && selectedQuestion.hint && (
              <div className="luxury-card p-4 mb-6 bg-blue-50 border-blue-200 hint-reveal">
                <h3 className="font-semibold text-blue-800 mb-2">تلميح:</h3>
                <p className="text-blue-700">{selectedQuestion.hint}</p>
              </div>
            )}

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
            <Button
              onClick={handleBackToBoard}
              variant="outline"
              className="luxury-button-secondary"
            >
              <ArrowLeft className="ml-2 h-4 w-4 text-luxury-green-dark" />
              العودة للوحة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game board view
  return (
    <div className="min-h-screen page-transition">
      {/* Header */}
      <header className="luxury-card mx-4 mt-4 p-6 mb-6 board-transition">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => setLocation("/dashboard")}
                className="luxury-button-secondary p-2 ml-4"
              >
                <ArrowLeft className="h-5 w-5 text-luxury-green-dark" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-luxury-green-dark">لوحة الأسئلة</h1>
                <p className="text-muted-foreground">
                  🔁 دور الفريق: <span className="font-semibold text-luxury-green turn-indicator px-3 py-1 rounded-full">
                    {gameSession.teams[gameSession.currentTurn]}
                  </span>
                </p>
              </div>
            </div>
            
            {/* Team Scores */}
            <div className="flex gap-4">
              {gameSession.teams.map((team: string, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-muted-foreground">{team}</div>
                  <div className="text-2xl font-bold text-luxury-green team-score-update">
                    {gameSession.teamScores[index] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Game Board */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {CATEGORIES.map((category, categoryIndex) => (
            <div key={category.id} className="luxury-card p-6 question-grid-item">
              {/* Category Header */}
              <div className="p-4 text-center bg-green-700 text-white font-bold rounded-lg border-2 border-green-600 question-category-pulse mb-6">
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-lg font-semibold">{category.name}</div>
              </div>
              
              {/* Question Groups by Difficulty */}
              <div className="space-y-4">
                {/* 200 Points (Easy) */}
                <div className="space-y-2">
                  <div className="text-center text-green-700 font-bold text-sm mb-2">200 نقطة</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1].map((index) => {
                      const isUsed = gameBoard[category.id]?.[index];
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(category.id, index)}
                          disabled={isUsed}
                          className={`w-full h-16 text-center font-bold text-lg transition-all duration-300 rounded-lg border-2 ${
                            isUsed
                              ? "bg-gray-400 text-gray-600 cursor-not-allowed border-gray-500 question-box-used"
                              : "bg-green-800 text-white hover:bg-green-900 border-green-600 shadow-lg hover:shadow-xl question-box-hover transform hover:-translate-y-1"
                          }`}
                          style={{
                            animationDelay: `${(categoryIndex * 6 + index) * 0.1}s`
                          }}
                        >
                          {isUsed ? (
                            <span className="text-2xl">✅</span>
                          ) : (
                            <div className="text-xl font-bold">200</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 400 Points (Medium) */}
                <div className="space-y-2">
                  <div className="text-center text-green-700 font-bold text-sm mb-2">400 نقطة</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[2, 3].map((index) => {
                      const isUsed = gameBoard[category.id]?.[index];
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(category.id, index)}
                          disabled={isUsed}
                          className={`w-full h-16 text-center font-bold text-lg transition-all duration-300 rounded-lg border-2 ${
                            isUsed
                              ? "bg-gray-400 text-gray-600 cursor-not-allowed border-gray-500 question-box-used"
                              : "bg-green-800 text-white hover:bg-green-900 border-green-600 shadow-lg hover:shadow-xl question-box-hover transform hover:-translate-y-1"
                          }`}
                          style={{
                            animationDelay: `${(categoryIndex * 6 + index) * 0.1}s`
                          }}
                        >
                          {isUsed ? (
                            <span className="text-2xl">✅</span>
                          ) : (
                            <div className="text-xl font-bold">400</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 600 Points (Hard) */}
                <div className="space-y-2">
                  <div className="text-center text-green-700 font-bold text-sm mb-2">600 نقطة</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[4, 5].map((index) => {
                      const isUsed = gameBoard[category.id]?.[index];
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(category.id, index)}
                          disabled={isUsed}
                          className={`w-full h-16 text-center font-bold text-lg transition-all duration-300 rounded-lg border-2 ${
                            isUsed
                              ? "bg-gray-400 text-gray-600 cursor-not-allowed border-gray-500 question-box-used"
                              : "bg-green-800 text-white hover:bg-green-900 border-green-600 shadow-lg hover:shadow-xl question-box-hover transform hover:-translate-y-1"
                          }`}
                          style={{
                            animationDelay: `${(categoryIndex * 6 + index) * 0.1}s`
                          }}
                        >
                          {isUsed ? (
                            <span className="text-2xl">✅</span>
                          ) : (
                            <div className="text-xl font-bold">600</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}