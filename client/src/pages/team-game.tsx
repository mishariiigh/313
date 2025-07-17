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
    markTeamCorrectMutation.mutate({ teamIndex, questionKey });
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
              {selectedQuestion.category} - {selectedQuestion.difficulty}
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
              {gameSession.teams.map((team: string, index: number) => (
                <Button
                  key={index}
                  onClick={() => handleTeamCorrect(index)}
                  className="luxury-button py-4 text-lg"
                  disabled={markTeamCorrectMutation.isPending}
                >
                  {team} ✅
                </Button>
              ))}
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-6 gap-4">
          {CATEGORIES.map((category, categoryIndex) => (
            <div key={category.id} className="space-y-2 question-grid-item">
              {/* Category Header */}
              <div className="luxury-card p-4 text-center bg-luxury-green text-white font-bold question-category-pulse">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm">{category.name}</div>
              </div>
              
              {/* Question Boxes */}
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const isUsed = gameBoard[category.id]?.[index];
                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(category.id, index)}
                    disabled={isUsed}
                    className={`luxury-card w-full h-16 text-center font-bold text-lg transition-all duration-300 ${
                      isUsed
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed question-box-used"
                        : "bg-luxury-green text-white hover:bg-luxury-green-dark shadow-lg hover:shadow-xl question-box-hover"
                    }`}
                    style={{
                      animationDelay: `${(categoryIndex * 6 + index) * 0.1}s`
                    }}
                  >
                    {isUsed ? "✅" : `${category.name} - ${index + 1}`}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}