import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Users, Trophy, HelpCircle, Eye, Shuffle, Plus, Minus, Pause, Play } from "lucide-react";
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
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);

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
    
    if (isTimerActive && !isTimerPaused && timeLeft > 0 && !isTimeOut) {
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
  }, [isTimerActive, isTimerPaused, timeLeft, isTimeOut]);

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
      setIsTimerPaused(false);
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
      setIsTimerPaused(false);
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
    setIsTimerPaused(false);
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

  // Question view - New Layout Structure
  if (selectedQuestion) {
    return (
      <div className="h-screen question-slide-in flex flex-col" dir="rtl" style={{
        background: 'linear-gradient(135deg, hsl(355, 30%, 97%) 0%, hsl(355, 25%, 94%) 100%)'
      }}>
        {/* Top Bar (Header) */}
        <div className="text-white p-3 flex-shrink-0" style={{
          background: 'linear-gradient(135deg, hsl(355, 75%, 60%) 0%, hsl(355, 85%, 50%) 100%)',
          boxShadow: '0 4px 20px hsla(355, 50%, 70%, 0.3)'
        }}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left Side - Navigation Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSelectedQuestion(null)}
                variant="outline"
                className="px-4 py-2 rounded-full border-2 hover:scale-105 transition-transform duration-200"
                style={{
                  background: 'hsla(0, 0%, 100%, 0.25)',
                  color: 'white',
                  borderColor: 'hsla(0, 0%, 100%, 0.4)'
                }}
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
                variant="outline"
                className="px-4 py-2 rounded-full border-2 hover:scale-105 transition-transform duration-200"
                style={{
                  background: 'hsla(0, 0%, 100%, 0.25)',
                  color: 'white',
                  borderColor: 'hsla(0, 0%, 100%, 0.4)'
                }}
              >
                إنهاء اللعبة
              </Button>
            </div>

            {/* Center - Team Name Display */}
            <div className="text-center">
              <div className="text-lg font-bold">
                دور: {gameSession.teams[gameSession.currentTurn]}
              </div>
            </div>

            {/* Right Side - Game Logo/Branding */}
            <div className="text-xl font-bold">
              ٣١٣
            </div>
          </div>
        </div>

        {/* Timer Section - Centrally Placed */}
        <div className="py-3 flex-shrink-0" style={{
          background: 'linear-gradient(135deg, hsl(355, 20%, 25%) 0%, hsl(355, 25%, 20%) 100%)',
          borderTop: '2px solid hsl(355, 30%, 30%)'
        }}>
          <div className="flex justify-center items-center">
            {(isTimerActive || isTimerPaused) && !isTimeOut && (
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="text-white rounded-full p-2 hover:scale-110 transition-transform duration-200"
                  style={{
                    background: 'hsl(355, 40%, 35%)',
                    border: '2px solid hsl(355, 50%, 45%)'
                  }}
                >
                  {isTimerPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
                <div className={`flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold border-4 transition-all duration-300 ${
                  isTimerPaused
                    ? 'bg-yellow-500 text-white border-yellow-600'
                    : timeLeft <= 10 
                    ? 'bg-red-600 text-white border-red-700 animate-pulse' 
                    : 'bg-white text-gray-800 border-gray-300'
                }`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <span className="text-white text-sm">
                  {isTimerPaused ? 'متوقف مؤقتاً' : timeLeft <= 10 ? 'الوقت ينفد!' : 'الوقت المتبقي'}
                </span>
              </div>
            )}
            
            {isTimeOut && (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold bg-red-800 text-white border-4 border-red-900">
                  0:00
                </div>
                <span className="text-white font-bold animate-pulse">انتهى الوقت!</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 min-h-0 overflow-hidden">
          <div className="max-w-7xl mx-auto flex gap-4 h-full">

            {/* Main Question Panel (Left Side - 80% width) */}
            <div className="flex-1" style={{ flex: '0 0 80%' }}>
              {/* Question with Triangle Border Design */}
              <div className="relative rounded-3xl p-6 h-full shadow-2xl overflow-hidden" style={{
                background: 'hsla(0, 0%, 100%, 0.95)',
                border: '3px solid hsl(355, 75%, 55%)',
                boxShadow: '0 8px 32px hsla(355, 50%, 70%, 0.25)'
              }}>
                {/* Decorative Triangle Border Effect */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      transparent 0px,
                      transparent 8px,
                      hsl(355, 75%, 55%) 8px,
                      hsl(355, 75%, 55%) 10px,
                      transparent 10px,
                      transparent 18px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent 0px,
                      transparent 8px,
                      hsl(355, 75%, 55%) 8px,
                      hsl(355, 75%, 55%) 10px,
                      transparent 10px,
                      transparent 18px
                    )
                  `,
                  mask: 'linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)',
                  maskComposite: 'xor',
                  WebkitMask: 'linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)',
                  WebkitMaskComposite: 'xor',
                  padding: '3px',
                  borderRadius: '24px'
                }} />
                
                {/* Inner Content Container */}
                <div className="relative rounded-2xl p-4 h-full flex flex-col justify-between border-2 overflow-hidden" style={{
                  background: 'hsla(0, 0%, 100%, 1)',
                  borderColor: 'hsl(355, 50%, 85%)'
                }}>
                  {/* Category Header */}
                  <div className="text-white rounded-2xl px-4 py-2 mb-4 text-center shadow-lg" style={{
                    background: 'linear-gradient(135deg, hsl(355, 75%, 60%) 0%, hsl(355, 85%, 50%) 100%)'
                  }}>
                    <h2 className="text-lg font-bold">
                      {(() => {
                        const categoryName = (selectedQuestion as any).questionKey?.split('-')[0];
                        const category = categories?.find(cat => cat.name === categoryName);
                        return category?.displayName || categoryName || 'فئة غير معروفة';
                      })()}
                    </h2>
                  </div>

                  {/* Question Title - Arabic, centered, bold */}
                  <div className="text-center mb-3">
                    <h1 className="text-2xl font-bold text-gray-800 leading-relaxed" style={{
                      fontFamily: 'Cairo, Arial, sans-serif',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {selectedQuestion.question}
                    </h1>
                  </div>
                  
                  {/* Question Image - Below question text */}
                  {selectedQuestion.imageUrl && (
                    <div className="flex justify-center mb-3 flex-1 min-h-0">
                      <div className="rounded-3xl p-2 shadow-xl border-2 max-w-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden" style={{
                        background: 'linear-gradient(135deg, hsl(355, 25%, 96%) 0%, hsl(355, 20%, 93%) 100%)',
                        borderColor: 'hsl(355, 40%, 85%)'
                      }}>
                        <img 
                          src={selectedQuestion.imageUrl} 
                          alt="صورة السؤال" 
                          className="w-full h-auto rounded-2xl shadow-lg"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '450px',
                            objectFit: 'contain'
                          }}
                          onClick={() => setImagePopupOpen(true)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Spacer if no image to center question */}
                  {!selectedQuestion.imageUrl && (
                    <div className="flex-1"></div>
                  )}

                  {/* Answer Button at Bottom - moved down */}
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={() => setShowAnswer(true)}
                      className="text-white px-6 py-3 text-lg font-bold rounded-3xl transition-all duration-300 shadow-xl transform hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, hsl(25, 85%, 60%) 0%, hsl(25, 90%, 50%) 100%)',
                        boxShadow: '0 8px 24px hsla(25, 85%, 60%, 0.4)'
                      }}
                    >
                      🔍 إظهار الإجابة
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel (Right Side) - Red Buttons */}
            <div className="w-64">
              <div className="text-white rounded-3xl shadow-2xl p-4 h-full border-2" style={{
                background: 'linear-gradient(135deg, hsl(355, 75%, 60%) 0%, hsl(355, 85%, 50%) 100%)',
                borderColor: 'hsl(355, 85%, 45%)',
                boxShadow: '0 8px 32px hsla(355, 50%, 70%, 0.3)'
              }}>
                {/* Current Team Display */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold mb-2">🎯 دور الفريق الحالي</h3>
                  <div className="bg-white bg-opacity-20 rounded-2xl p-3 shadow-lg border border-white border-opacity-30">
                    <div className="text-xl font-bold">{gameSession.teams[gameSession.currentTurn]}</div>
                  </div>
                </div>

                {/* Team Points Display */}
                <div className="mb-4">
                  <h4 className="text-md font-bold mb-2 text-center">🏆 نقاط الفرق</h4>
                  <div className="space-y-2">
                    {gameSession.teams.map((team: string, index: number) => (
                      <div 
                        key={index} 
                        className={`bg-white bg-opacity-20 rounded-2xl p-2 flex justify-between items-center shadow-lg border border-white border-opacity-30 ${
                          index === gameSession.currentTurn ? 'ring-2 ring-white bg-opacity-30' : ''
                        }`}
                      >
                        <span className="font-bold text-sm">{team}</span>
                        <span className="text-md font-bold">{gameSession.teamScores[index] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
                


                {/* Hint Option - Red Button */}
                <div className="space-y-3 mb-4">
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
                        className={`w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-3 text-md font-bold rounded-2xl transition-all duration-300 shadow-lg border border-white border-opacity-30 ${currentTeamHintUsed ? 'opacity-50 cursor-not-allowed' : isHintUsed ? 'opacity-75' : ''}`}
                        disabled={useHintMutation.isPending || currentTeamHintUsed}
                      >
                        <HelpCircle className="ml-2 h-5 w-5" />
                        {showHint ? "إخفاء التلميح" : 
                         isHintUsed ? "إظهار التلميح" : 
                         currentTeamHintUsed ? "تم استخدام التلميح" : 
                         "تلميح"}
                      </Button>
                    );
                  })()}
                </div>

                {/* Additional Control Buttons - Red */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSkipQuestion()}
                    className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-3 text-md font-bold rounded-2xl transition-all duration-300 shadow-lg border border-white border-opacity-30"
                    disabled={skipQuestionMutation.isPending}
                  >
                    تخطي السؤال
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hint Section - Full Width Below Main Content */}
        {showHint && selectedQuestion.hint && (
          <div className="p-3 flex-shrink-0" style={{
            background: 'linear-gradient(135deg, hsl(355, 25%, 95%) 0%, hsl(355, 20%, 92%) 100%)'
          }}>
            <div className="max-w-7xl mx-auto">
              <div className="rounded-2xl p-4 hint-reveal border-3" style={{
                background: 'hsl(200, 80%, 95%)',
                borderColor: 'hsl(200, 70%, 60%)',
                borderStyle: 'dashed'
              }}>
                <div className="text-white rounded-xl px-4 py-2 inline-block mb-3 shadow-lg" style={{
                  background: 'linear-gradient(135deg, hsl(200, 75%, 60%) 0%, hsl(200, 85%, 50%) 100%)'
                }}>
                  <h3 className="font-bold text-md">💡 تلميح</h3>
                </div>
                <p className="text-md font-medium leading-relaxed" style={{
                  fontFamily: 'Cairo, Arial, sans-serif',
                  color: 'hsl(200, 80%, 25%)'
                }}>{selectedQuestion.hint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Image Popup Modal */}
        {imagePopupOpen && selectedQuestion?.imageUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background Blur Overlay */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setImagePopupOpen(false)}
            />
            
            {/* Modal Content - Full Size Image */}
            <div className="relative max-w-[90vw] max-h-[90vh] p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={() => setImagePopupOpen(false)}
                  className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Full Size Image */}
                <img 
                  src={selectedQuestion.imageUrl} 
                  alt="صورة السؤال - عرض كامل" 
                  className="w-full h-auto"
                  style={{
                    maxHeight: '85vh',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Answer Modal - Creative Card Design */}
        {showAnswer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Blur Overlay */}
            <div 
              className="absolute inset-0 backdrop-blur-md"
              onClick={() => setShowAnswer(false)}
              style={{
                background: 'linear-gradient(135deg, hsla(355, 25%, 15%, 0.8) 0%, hsla(355, 30%, 20%, 0.9) 100%)'
              }}
            />
            
            {/* Modal Content - Creative Card Design */}
<div className="relative max-w-2xl w-full h-[85vh] flex flex-col" dir="rtl">
              {/* Main Card Container */}
              <div className="relative rounded-3xl shadow-2xl overflow-hidden transform scale-100 animate-in duration-300 h-full flex flex-col" style={{
                background: 'linear-gradient(135deg, hsl(355, 15%, 98%) 0%, hsl(355, 20%, 95%) 100%)',
                border: '4px solid hsl(355, 60%, 55%)',
                boxShadow: '0 25px 50px hsla(355, 50%, 30%, 0.4), 0 0 0 1px hsla(355, 70%, 60%, 0.2)'
              }}>
                
                {/* Top Header with Close Button */}
                <div className="relative p-4 text-center flex-shrink-0" style={{
                  background: 'linear-gradient(135deg, hsl(355, 75%, 55%) 0%, hsl(355, 80%, 45%) 50%, hsl(355, 75%, 55%) 100%)'
                }}>
                  {/* Close Button */}
                  <button
                    onClick={() => setShowAnswer(false)}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: 'hsla(0, 0%, 100%, 0.2)',
                      border: '2px solid hsla(0, 0%, 100%, 0.3)'
                    }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Header Content */}
                  <div className="text-white">
                    <div className="text-3xl mb-1">🎯</div>
                    <h2 className="text-xl font-bold">الإجابة الصحيحة</h2>
                    <div className="text-xs opacity-90">انقر على الفريق الذي أجاب بشكل صحيح</div>
                  </div>
                </div>

                {/* Answer Display Section */}
                <div className="p-4 text-center flex-shrink-0">
                  <div className="mb-4 p-4 rounded-2xl" style={{
                    background: 'linear-gradient(135deg, hsl(200, 90%, 97%) 0%, hsl(200, 85%, 94%) 100%)',
                    border: '3px solid hsl(200, 70%, 80%)',
                    boxShadow: 'inset 0 2px 8px hsla(200, 50%, 70%, 0.2)'
                  }}>
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3" style={{
                        background: 'linear-gradient(135deg, hsl(200, 75%, 55%) 0%, hsl(200, 80%, 45%) 100%)'
                      }}>
                        ✓
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'hsl(200, 70%, 35%)' }}>الجواب</span>
                    </div>
                    <p className="text-xl font-bold leading-relaxed" style={{
                      fontFamily: 'Cairo, Arial, sans-serif',
                      color: 'hsl(200, 80%, 25%)'
                    }}>
                      {selectedQuestion.answer}
                    </p>
                  </div>
                  
                  {selectedQuestion.explanation && (
                    <div className="mb-3 p-3 rounded-2xl" style={{
                      background: 'linear-gradient(135deg, hsl(45, 90%, 97%) 0%, hsl(45, 85%, 94%) 100%)',
                      border: '2px solid hsl(45, 70%, 80%)'
                    }}>
                      <div className="flex items-center mb-2">
                        <div className="text-lg mr-2">💡</div>
                        <span className="text-sm font-bold" style={{ color: 'hsl(45, 80%, 35%)' }}>توضيح</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{
                        fontFamily: 'Cairo, Arial, sans-serif',
                        color: 'hsl(45, 70%, 30%)'
                      }}>
                        {selectedQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Team Selection Section */}
                <div className="px-4 pb-2 flex-1 min-h-0 overflow-y-auto">
                  <div className="grid gap-2">
                    {gameSession.teams.map((team: string, index: number) => {
                      const questionKey = (selectedQuestion as any).questionKey;
                      const points = questionKey ? (() => {
                        const idx = parseInt(questionKey.split('-')[1]);
                        return idx < 2 ? 200 : idx < 4 ? 400 : 600;
                      })() : getPointsForDifficulty(selectedQuestion.difficulty);
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            handleTeamCorrect(index);
                            setShowAnswer(false);
                          }}
                          className="p-2 rounded-xl transition-all duration-300 hover:scale-105 transform shadow-lg group"
                          style={{
                            background: 'linear-gradient(135deg, hsl(140, 75%, 55%) 0%, hsl(140, 80%, 45%) 100%)',
                            border: '2px solid hsl(140, 70%, 40%)',
                            boxShadow: '0 4px 16px hsla(140, 60%, 40%, 0.3)'
                          }}
                          disabled={markTeamCorrectMutation.isPending}
                        >
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 group-hover:scale-110 transition-transform" style={{
                                background: 'hsla(0, 0%, 100%, 0.2)'
                              }}>
                                🏆
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold">{team}</div>
                                <div className="text-xs opacity-90">{points} نقطة</div>
                              </div>
                            </div>
                            <div className="text-lg opacity-70">→</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="p-3 space-y-1 flex-shrink-0" style={{
                  background: 'linear-gradient(135deg, hsl(355, 10%, 96%) 0%, hsl(355, 15%, 93%) 100%)',
                  borderTop: '2px solid hsl(355, 30%, 85%)'
                }}>
                  <button
                    onClick={() => {
                      handleSkipQuestion();
                      setShowAnswer(false);
                    }}
                    className="w-full p-2 rounded-xl transition-all duration-300 hover:scale-105 transform font-bold text-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, hsl(25, 85%, 60%) 0%, hsl(25, 90%, 50%) 100%)',
                      border: '2px solid hsl(25, 80%, 45%)'
                    }}
                    disabled={skipQuestionMutation.isPending}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-sm mr-1">⏭️</span>
                      <span className="text-xs">لم يجب أي فريق بشكل صحيح</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowAnswer(false)}
                    className="w-full p-1 rounded-xl transition-all duration-300 hover:scale-105 transform font-bold border-2"
                    style={{
                      background: 'hsl(355, 25%, 95%)',
                      color: 'hsl(355, 40%, 30%)',
                      borderColor: 'hsl(355, 50%, 75%)'
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-sm mr-1">↩️</span>
                      <span className="text-xs">العودة للسؤال</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Game board view - Jeopardy style layout
  return (
    <div className="min-h-screen flex flex-col page-transition" style={{
      background: 'linear-gradient(135deg, hsl(355, 30%, 97%) 0%, hsl(355, 25%, 94%) 100%)'
    }}>
      {/* Header - Top navigation with scores */}
      <header className="p-4" style={{
        background: 'linear-gradient(135deg, hsl(355, 60%, 90%) 0%, hsl(355, 50%, 85%) 100%)',
        borderBottom: '3px solid hsl(355, 40%, 80%)',
        boxShadow: '0 4px 20px hsla(355, 50%, 70%, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="border-2 hover:scale-105 transition-transform duration-200"
              style={{
                background: 'hsla(0, 0%, 100%, 0.9)',
                color: 'hsl(345, 35%, 25%)',
                borderColor: 'hsl(355, 75%, 65%)'
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium" style={{ color: 'hsl(345, 35%, 25%)' }}>
                دور: <span className="font-bold px-3 py-1 rounded-full" style={{
                  background: 'hsla(0, 0%, 100%, 0.8)',
                  color: 'hsl(355, 85%, 55%)',
                  border: '2px solid hsl(355, 75%, 65%)'
                }}>
                  {gameSession.teams[gameSession.currentTurn]}
                </span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchTeamTurnMutation.mutate()}
                disabled={switchTeamTurnMutation.isPending}
                className="border-2 hover:scale-105 transition-transform duration-200"
                style={{
                  background: 'hsla(0, 0%, 100%, 0.9)',
                  color: 'hsl(345, 35%, 25%)',
                  borderColor: 'hsl(355, 75%, 65%)'
                }}
                title="تبديل الدور"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Team Scores */}
          <div className="flex gap-4">
            {gameSession.teams.map((team: string, index: number) => (
              <div key={index} className="rounded-lg p-3 text-center min-w-[140px] border-2" style={{
                background: 'hsla(0, 0%, 100%, 0.85)',
                borderColor: 'hsl(355, 75%, 65%)',
                color: 'hsl(345, 35%, 25%)',
                boxShadow: '0 4px 12px hsla(355, 50%, 70%, 0.2)'
              }}>
                <div className="text-sm font-semibold">{team}</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustScoreMutation.mutate({ teamIndex: index, scoreChange: -50 })}
                    disabled={adjustScoreMutation.isPending}
                    className="border hover:scale-110 transition-transform duration-200 p-1 h-6 w-6"
                    style={{
                      background: 'hsla(0, 0%, 100%, 0.9)',
                      color: 'hsl(355, 85%, 55%)',
                      borderColor: 'hsl(355, 65%, 75%)'
                    }}
                    title="تقليل النقاط"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="text-xl font-bold min-w-[40px]" style={{ color: 'hsl(355, 85%, 55%)' }}>
                    {gameSession.teamScores[index] || 0}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustScoreMutation.mutate({ teamIndex: index, scoreChange: 50 })}
                    disabled={adjustScoreMutation.isPending}
                    className="border hover:scale-110 transition-transform duration-200 p-1 h-6 w-6"
                    style={{
                      background: 'hsla(0, 0%, 100%, 0.9)',
                      color: 'hsl(355, 85%, 55%)',
                      borderColor: 'hsl(355, 65%, 75%)'
                    }}
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
                <div className="rounded-3xl shadow-xl overflow-hidden border-3 p-2" style={{
                  background: 'hsla(0, 0%, 100%, 0.95)',
                  borderColor: 'hsl(355, 40%, 85%)',
                  boxShadow: '0 8px 32px hsla(355, 50%, 70%, 0.2)'
                }}>
                  
                  <div className="flex items-center justify-center gap-2">
                    {/* Left Column - Stacked Buttons with no gaps */}
                    <div className="flex flex-col">
                      {/* Left 200 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 0)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-0`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 mb-1 ${
                          gameSession.usedQuestions?.includes(`${category.name}-0`)
                            ? "cursor-not-allowed"
                            : "shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                        style={gameSession.usedQuestions?.includes(`${category.name}-0`) ? {
                          background: 'hsl(0, 0%, 70%)',
                          color: 'hsl(0, 0%, 50%)'
                        } : {
                          background: 'linear-gradient(135deg, hsl(355, 50%, 88%) 0%, hsl(355, 40%, 85%) 100%)',
                          color: 'hsl(355, 85%, 55%)',
                          border: '2px solid hsl(355, 60%, 80%)'
                        }}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-0`) ? "✓" : "200"}
                      </button>
                      
                      {/* Left 400 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 2)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-2`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 mb-1 ${
                          gameSession.usedQuestions?.includes(`${category.name}-2`)
                            ? "cursor-not-allowed"
                            : "shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                        style={gameSession.usedQuestions?.includes(`${category.name}-2`) ? {
                          background: 'hsl(0, 0%, 70%)',
                          color: 'hsl(0, 0%, 50%)'
                        } : {
                          background: 'linear-gradient(135deg, hsl(355, 50%, 88%) 0%, hsl(355, 40%, 85%) 100%)',
                          color: 'hsl(355, 85%, 55%)',
                          border: '2px solid hsl(355, 60%, 80%)'
                        }}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-2`) ? "✓" : "400"}
                      </button>
                      
                      {/* Left 600 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 4)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-4`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                          gameSession.usedQuestions?.includes(`${category.name}-4`)
                            ? "cursor-not-allowed"
                            : "shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                        style={gameSession.usedQuestions?.includes(`${category.name}-4`) ? {
                          background: 'hsl(0, 0%, 70%)',
                          color: 'hsl(0, 0%, 50%)'
                        } : {
                          background: 'linear-gradient(135deg, hsl(355, 50%, 88%) 0%, hsl(355, 40%, 85%) 100%)',
                          color: 'hsl(355, 85%, 55%)',
                          border: '2px solid hsl(355, 60%, 80%)'
                        }}
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
                      <div className="w-40 text-white py-3 px-3 rounded-b-3xl text-center" style={{
                        background: 'linear-gradient(135deg, hsl(355, 75%, 60%) 0%, hsl(355, 85%, 50%) 100%)'
                      }}>
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
                            ? "cursor-not-allowed"
                            : "shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                        style={gameSession.usedQuestions?.includes(`${category.name}-1`) ? {
                          background: 'hsl(0, 0%, 70%)',
                          color: 'hsl(0, 0%, 50%)'
                        } : {
                          background: 'linear-gradient(135deg, hsl(355, 50%, 88%) 0%, hsl(355, 40%, 85%) 100%)',
                          color: 'hsl(355, 85%, 55%)',
                          border: '2px solid hsl(355, 60%, 80%)'
                        }}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-1`) ? "✓" : "200"}
                      </button>
                      
                      {/* Right 400 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 3)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-3`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 mb-1 ${
                          gameSession.usedQuestions?.includes(`${category.name}-3`)
                            ? "cursor-not-allowed"
                            : "shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                        style={gameSession.usedQuestions?.includes(`${category.name}-3`) ? {
                          background: 'hsl(0, 0%, 70%)',
                          color: 'hsl(0, 0%, 50%)'
                        } : {
                          background: 'linear-gradient(135deg, hsl(355, 50%, 88%) 0%, hsl(355, 40%, 85%) 100%)',
                          color: 'hsl(355, 85%, 55%)',
                          border: '2px solid hsl(355, 60%, 80%)'
                        }}
                      >
                        {gameSession.usedQuestions?.includes(`${category.name}-3`) ? "✓" : "400"}
                      </button>
                      
                      {/* Right 600 Button */}
                      <button
                        onClick={() => handleQuestionClick(category.name, 5)}
                        disabled={gameSession.usedQuestions?.includes(`${category.name}-5`)}
                        className={`w-24 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                          gameSession.usedQuestions?.includes(`${category.name}-5`)
                            ? "cursor-not-allowed"
                            : "shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                        style={gameSession.usedQuestions?.includes(`${category.name}-5`) ? {
                          background: 'hsl(0, 0%, 70%)',
                          color: 'hsl(0, 0%, 50%)'
                        } : {
                          background: 'linear-gradient(135deg, hsl(355, 50%, 88%) 0%, hsl(355, 40%, 85%) 100%)',
                          color: 'hsl(355, 85%, 55%)',
                          border: '2px solid hsl(355, 60%, 80%)'
                        }}
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