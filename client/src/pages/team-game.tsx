import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Users, Trophy, HelpCircle, Eye, Shuffle, Plus, Minus } from "lucide-react";
import { Question } from "@/../../shared/schema";

// Default category icons for common categories
const CATEGORY_ICONS: { [key: string]: string } = {
  "التاريخ": "📚",
  "الجغرافيا": "🌍", 
  "الثقافة العامة": "🧠",
  "الرياضة": "🏅",
  "الدين": "✨",
  "العلوم": "🔬",
  "الفنون": "🎨",
  "الطبيعة": "🌿",
  "التكنولوجيا": "💻",
  "الطعام": "🍽️",
  "الموسيقى": "🎵",
  "الطب": "⚕️",
  "history": "📚",
  "geography": "🌍",
  "culture": "🧠",
  "sports": "🏅",
  "religion": "✨",
  "science": "🔬",
};

interface TeamGamePageProps {
  params: {
    id: string;
  };
}

// Helper function to get points based on difficulty
const getPointsForDifficulty = (difficulty: string): number => {
  switch (difficulty) {
    case 'سهل':
      return 200;
    case 'متوسط':
      return 400;
    case 'صعب':
      return 600;
    default:
      return 200;
  }
};

export default function TeamGamePage({ params }: TeamGamePageProps) {
  const id = params.id;
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);

  // Get game session data
  const { data: gameData, isLoading } = useQuery({
    queryKey: [`/api/games/${id}`],
    enabled: !!id,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Questions are included in the game data for team games

  // Create categories array from selected categories in game session
  const gameSession = gameData?.gameSession;
  const selectedCategoryNames = gameSession?.selectedCategories || [];
  const categories = categoriesData?.categories?.filter((cat: any) => 
    cat.isActive && selectedCategoryNames.includes(cat.name) && cat.name && cat.displayName
  ).map((cat: any) => ({
    id: cat.name,
    name: cat.name,        // Use English name for backend API compatibility
    displayName: cat.displayName, // Use Arabic name for UI display
    logoUrl: cat.logoUrl,  // Include the uploaded image URL
    icon: CATEGORY_ICONS[cat.name] || CATEGORY_ICONS[cat.displayName] || "📝"
  })) || [];

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    if (gameData && categories.length > 0) {
      // Check if game is completed and auto-complete if needed
      const totalQuestions = categories.length * 6; // 6 questions per category
      if (gameData.gameSession?.usedQuestions?.length >= totalQuestions && !gameData.gameSession?.isCompleted) {
        // Auto-complete the game
        apiRequest("POST", `/api/games/${id}/complete`).then(() => {
          queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
        });
      }
    }
  }, [user, gameData, setLocation, id]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0 && !isTimeOut) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerActive(false);
            setIsTimeOut(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft, isTimeOut]);

  // Toast effect for time out
  useEffect(() => {
    if (isTimeOut) {
      toast({
        title: "انتهى الوقت!",
        description: "لم يتم الإجابة في الوقت المحدد",
        variant: "destructive",
      });
    }
  }, [isTimeOut, toast]);

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
      setIsTimerActive(false);
      setIsTimeOut(false);
      setTimeLeft(60);
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
      setIsTimerActive(false);
      setIsTimeOut(false);
      setTimeLeft(60);
    },
  });

  // Use hint for a question
  const useHintMutation = useMutation({
    mutationFn: async (data: { questionKey: string; teamIndex: number }) => {
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

  // Debug logging for categories
  useEffect(() => {
    if (categories && categories.length > 0) {
      console.log("Categories with images:", categories);
      categories.forEach(cat => {
        console.log(`Category ${cat.name} (${cat.displayName}): logoUrl = "${cat.logoUrl}"`);
      });
    }
  }, [categories]);

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

  // Check if game is completed
  const totalQuestions = categories.length * 6; // 6 questions per category
  const isGameCompleted = gameSession.usedQuestions?.length >= totalQuestions;
  
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

  const handleQuestionClick = (categoryName: string, index: number) => {
    // Check if question is already used
    const questionKey = `${categoryName}-${index}`;
    if (gameSession.usedQuestions?.includes(questionKey)) {
      return;
    }

    // Find the question - questions are organized by category in groups of 6
    const categoryIndex = categories.findIndex(cat => cat.name === categoryName);
    const questionIndex = categoryIndex * 6 + index;
    const question = gameData?.questions?.[questionIndex];
    
    console.log(`Clicking question: categoryName=${categoryName}, index=${index}, categoryIndex=${categoryIndex}, questionIndex=${questionIndex}, questionKey=${questionKey}`);
    
    if (question) {
      // Store the question key with the question so we can use it later
      setSelectedQuestion({...question, questionKey});
      // Check if hint was already used for this question
      const isHintUsed = gameSession.usedHints?.includes(questionKey);
      setShowHint(isHintUsed);
      setShowAnswer(false);
      // Start the timer
      setTimeLeft(60);
      setIsTimerActive(true);
      setIsTimeOut(false);
    }
  };

  const handleBackToBoard = () => {
    setSelectedQuestion(null);
    setShowHint(false);
    setShowAnswer(false);
    setIsTimerActive(false);
    setIsTimeOut(false);
    setTimeLeft(60);
  };

  const handleTeamCorrect = (teamIndex: number) => {
    if (!selectedQuestion) return;
    
    // Use the stored question key directly
    const questionKey = (selectedQuestion as any).questionKey;
    if (questionKey) {
      console.log(`Team ${teamIndex} answered ${questionKey} correctly`);
      markTeamCorrectMutation.mutate({ teamIndex, questionKey });
    } else {
      console.error(`No question key stored for selected question`);
    }
  };

  const handleSkipQuestion = () => {
    if (!selectedQuestion) return;
    
    // Use the stored question key directly
    const questionKey = (selectedQuestion as any).questionKey;
    if (questionKey) {
      console.log(`Skipping question ${questionKey}`);
      skipQuestionMutation.mutate({ questionKey });
    } else {
      console.error(`No question key stored for selected question`);
    }
  };

  const handleUseHint = () => {
    if (!selectedQuestion) return;
    
    // Use the stored question key directly
    const questionKey = (selectedQuestion as any).questionKey;
    if (questionKey) {
      console.log(`Using hint for question ${questionKey}`);
      useHintMutation.mutate({ 
        questionKey, 
        teamIndex: gameSession.currentTurn 
      });
    } else {
      console.error(`No question key stored for selected question`);
    }
  };

  const getCurrentQuestionKey = () => {
    if (!selectedQuestion) return null;
    
    // Use the stored question key directly
    return (selectedQuestion as any).questionKey || null;
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
          {/* Question Card - New Layout Matching Provided Image */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 question-slide-in max-w-5xl mx-auto" dir="rtl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm opacity-90">
                    {selectedQuestion.category}
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                    {(() => {
                      const questionKey = (selectedQuestion as any).questionKey;
                      if (questionKey) {
                        const index = parseInt(questionKey.split('-')[1]);
                        return index < 2 ? 200 : index < 4 ? 400 : 600;
                      }
                      return getPointsForDifficulty(selectedQuestion.difficulty);
                    })()} نقطة
                  </div>
                </div>
                
                {/* Timer Display - Moved to header */}
                {isTimerActive && !isTimeOut && (
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold transition-all duration-300 ${
                      timeLeft <= 10 
                        ? 'bg-red-300 text-red-800 timer-urgent border-2 border-red-400' 
                        : 'bg-white/20 text-white'
                    }`}>
                      {timeLeft}
                    </div>
                    <span className="text-sm opacity-90">
                      {timeLeft <= 10 ? 'الوقت ينفد!' : 'ثانية'}
                    </span>
                  </div>
                )}
                
                {/* Time Out Message */}
                {isTimeOut && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold bg-red-800 text-white border-2 border-red-900">
                      0
                    </div>
                    <span className="text-sm font-bold animate-pulse">انتهى الوقت!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area - Question and Image */}
            <div className="bg-gray-50 rounded-2xl border-4 border-red-200 p-6">
              {/* Question Title */}
              <h1 className="text-2xl font-bold text-gray-800 text-center mb-6 question-card-flip">
                {selectedQuestion.question}
              </h1>
              
              {/* Question Image - Centered and Properly Sized */}
              {selectedQuestion.imageUrl && (
                <div className="flex justify-center mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
                    <img 
                      src={selectedQuestion.imageUrl} 
                      alt="صورة السؤال" 
                      className="max-w-full h-auto rounded-lg"
                      style={{
                        maxWidth: '400px',
                        maxHeight: '300px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Control Buttons with New Styling */}
            <div className="flex justify-center gap-4 mb-6 mt-6">
              {(() => {
                const currentQuestionKey = getCurrentQuestionKey();
                const isHintUsed = currentQuestionKey && gameSession.usedHints?.includes(currentQuestionKey);
                const currentTeamHintUsed = gameSession.teamHintsUsed?.[gameSession.currentTurn];
                
                return (
                  <Button
                    onClick={() => {
                      if (showHint) {
                        setShowHint(false);
                      } else if (isHintUsed) {
                        setShowHint(true);
                      } else if (currentTeamHintUsed) {
                        toast({
                          title: "تم استخدام التلميح",
                          description: "هذا الفريق استخدم التلميح بالفعل في اللعبة",
                          variant: "destructive",
                        });
                      } else {
                        handleUseHint();
                      }
                    }}
                    variant="outline"
                    className={`bg-blue-500 hover:bg-blue-600 text-white border-blue-400 px-6 py-3 rounded-full transition-all duration-300 ${currentTeamHintUsed ? 'opacity-50 cursor-not-allowed' : isHintUsed ? 'opacity-75' : ''}`}
                    disabled={useHintMutation.isPending || currentTeamHintUsed}
                  >
                    <HelpCircle className="ml-2 h-4 w-4" />
                    {showHint ? "إخفاء التلميح" : 
                     isHintUsed ? "إظهار التلميح (مُستخدم)" : 
                     currentTeamHintUsed ? "تم استخدام التلميح" : 
                     "استخدام التلميح"}
                  </Button>
                );
              })()}
              
              <Button
                onClick={() => setShowAnswer(!showAnswer)}
                className="bg-green-500 hover:bg-green-600 text-white border-green-400 px-6 py-3 rounded-full transition-all duration-300"
              >
                <Eye className="ml-2 h-4 w-4" />
                {showAnswer ? "إخفاء الإجابة" : "إظهار الإجابة"}
              </Button>
            </div>

            {/* Hint and Answer Sections with New Styling */}
            {showHint && selectedQuestion.hint && (
              <div className="bg-blue-100 border-4 border-blue-300 rounded-2xl p-6 mb-6 hint-reveal">
                <div className="bg-blue-500 text-white rounded-lg px-4 py-2 inline-block mb-4">
                  <h3 className="font-bold text-lg">💡 تلميح</h3>
                </div>
                <p className="text-blue-800 text-lg font-medium">{selectedQuestion.hint}</p>
              </div>
            )}

            {showAnswer && (
              <div className="bg-green-100 border-4 border-green-300 rounded-2xl p-6 mb-6 answer-reveal">
                <div className="bg-green-500 text-white rounded-lg px-4 py-2 inline-block mb-4">
                  <h3 className="font-bold text-lg">✅ الإجابة الصحيحة</h3>
                </div>
                <p className="text-green-800 text-2xl font-bold mb-3">{selectedQuestion.answer}</p>
                {selectedQuestion.explanation && (
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                    <p className="text-green-700 text-lg">{selectedQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Team Selection with Enhanced Styling */}
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-4 border-gray-200">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl p-4 mb-6 text-center">
              <h3 className="text-xl font-bold">
                أي فريق أجاب بشكل صحيح؟
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {gameSession.teams.map((team: string, index: number) => {
                const questionKey = (selectedQuestion as any).questionKey;
                const points = questionKey ? (() => {
                  const idx = parseInt(questionKey.split('-')[1]);
                  return idx < 2 ? 200 : idx < 4 ? 400 : 600;
                })() : getPointsForDifficulty(selectedQuestion.difficulty);
                
                return (
                  <Button
                    key={index}
                    onClick={() => handleTeamCorrect(index)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    disabled={markTeamCorrectMutation.isPending}
                  >
                    <div className="text-center">
                      <div>{team}</div>
                      <div className="text-sm opacity-90">✅ (+{points} نقطة)</div>
                    </div>
                  </Button>
                );
              })}
            </div>
            
            <Button
              onClick={handleSkipQuestion}
              variant="outline"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 text-lg font-medium rounded-2xl border-2 border-gray-300 transition-all duration-300"
              disabled={skipQuestionMutation.isPending}
            >
              تخطي - لم يجب أي فريق بشكل صحيح
            </Button>
          </div>

          {/* Back to Board with Enhanced Styling */}
          <div className="text-center">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleBackToBoard}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
              >
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة للوحة
              </Button>
              
              <Button
                onClick={async () => {
                  if (window.confirm("هل أنت متأكد من إنهاء اللعبة؟")) {
                    await apiRequest("POST", `/api/games/${id}/complete`);
                    setLocation("/dashboard");
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
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
          {/* Enhanced Category Layout - Matching Provided Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto" dir="rtl">
            {categories.slice(0, 6).map((category, categoryIndex) => (
              <div key={`category-enhanced-${categoryIndex}`} className="relative">
                {/* Category Card with Enhanced Layout */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-3 border-gray-300 p-2">
                  
                  <div className="flex items-center justify-center gap-2">
                    {/* Left Column - Stacked Buttons with no gaps */}
                    <div className="flex flex-col">
                      {/* Left 200 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 0)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-0`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 mb-1 ${
                          gameSession.usedQuestions?.includes(`${category.name}-0`)
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-red-600 hover:bg-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-0`) ? "✓" : "200"}
                      </button>
                      
                      {/* Left 400 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 2)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-2`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 mb-1 ${
                          gameSession.usedQuestions?.includes(`${category.name}-2`)
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-red-600 hover:bg-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-2`) ? "✓" : "400"}
                      </button>
                      
                      {/* Left 600 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 4)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-4`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                          gameSession.usedQuestions?.includes(`${category.name}-4`)
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-red-600 hover:bg-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-4`) ? "✓" : "600"}
                      </button>
                    </div>

                    {/* Center Column - Category Image and Title */}
                    <div className="flex flex-col relative w-40">
                      {/* Category Image - Larger and more prominent */}
                      <div className="relative w-40 h-48 rounded-t-3xl overflow-hidden bg-gradient-to-br from-blue-200 to-blue-400">
                        {category.logoUrl && category.logoUrl.trim() !== "" ? (
                          <img 
                            src={category.logoUrl} 
                            alt={category.displayName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log(`Image failed to load for category ${category.name}: ${category.logoUrl}`);
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log(`Image loaded successfully for category ${category.name}: ${category.logoUrl}`);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center">
                            <div className="text-4xl text-white">
                              {CATEGORY_ICONS[category.name] || CATEGORY_ICONS[category.displayName] || "📚"}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Category Name - Full width bottom bar */}
                      <div className="w-40 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-3 rounded-b-3xl text-center">
                        <div className="font-bold text-sm leading-tight">
                          {category.displayName || category.name}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Stacked Buttons with no gaps */}
                    <div className="flex flex-col">
                      {/* Right 200 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 1)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-1`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 mb-1 ${
                          gameSession.usedQuestions?.includes(`${category.name}-1`)
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-red-600 hover:bg-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-1`) ? "✓" : "200"}
                      </button>
                      
                      {/* Right 400 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 3)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-3`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 mb-1 ${
                          gameSession.usedQuestions?.includes(`${category.name}-3`)
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-red-600 hover:bg-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-3`) ? "✓" : "400"}
                      </button>
                      
                      {/* Right 600 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 5)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-5`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                          gameSession.usedQuestions?.includes(`${category.name}-5`)
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-red-600 hover:bg-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-5`) ? "✓" : "600"}
                      </button>
                    </div>
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