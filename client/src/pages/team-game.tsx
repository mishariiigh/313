
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, Shuffle, Plus, Minus, Pause, Play } from "lucide-react";
import { Question } from "@/../../shared/schema";
import { Logo } from "@/components/Logo";

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

  const { data: gameData, isLoading } = useQuery({
    queryKey: [`/api/games/${id}`],
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
      const totalQuestions = categories.length * 6; // 6 questions per category
      if (gameData.gameSession?.usedQuestions?.length >= totalQuestions && !gameData.gameSession?.isCompleted) {
        apiRequest("POST", `/api/games/${id}/complete`).then(() => {
          queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
        });
      }
    }
  }, [user, gameData, setLocation, id]);

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

  useEffect(() => {
    if (isTimeOut) {
      toast({
        title: "انتهى الوقت!",
        description: "لم يتم الإجابة في الوقت المحدد",
        variant: "destructive",
      });
    }
  }, [isTimeOut, toast]);

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

  const switchTeamTurnMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/games/${id}/switch-turn`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${id}`] });
    },
  });

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
          <h1 className="text-2xl font-bold text-red-700 mb-4">جلسة اللعبة غير موجودة</h1>
          <Button onClick={() => setLocation("/dashboard")}>العودة للوحة التحكم</Button>
        </div>
      </div>
    );
  }

  const totalQuestions = categories.length * 6; // 6 questions per category
  const isGameCompleted = gameSession.usedQuestions?.length >= totalQuestions;

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
    const questionKey = `${categoryName}-${index}`;
    if (gameSession.usedQuestions?.includes(questionKey)) {
      return;
    }

    const categoryIndex = categories.findIndex(cat => cat.name === categoryName);
    const questionIndex = categoryIndex * 6 + index;
    const question = gameData?.questions?.[questionIndex];

    if (question) {
      setSelectedQuestion({...question, questionKey});

      const isHintUsed = gameSession.usedHints?.includes(questionKey);
      setShowHint(isHintUsed);
      setShowAnswer(false);

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

    const questionKey = selectedQuestion.questionKey;
    if (questionKey) {
      markTeamCorrectMutation.mutate({ teamIndex, questionKey });
    } else {
      console.error(`No question key stored for selected question`);
    }
  };

  const handleSkipQuestion = () => {
    if (!selectedQuestion) return;

    const questionKey = selectedQuestion.questionKey;
    if (questionKey) {
      skipQuestionMutation.mutate({ questionKey });
    } else {
      console.error(`No question key stored for selected question`);
    }
  };

  const handleUseHint = () => {
    if (!selectedQuestion) return;

    const questionKey = selectedQuestion.questionKey;
    if (questionKey) {
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
    return selectedQuestion.questionKey || null;
  };

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
            
            <div className="p-6 rounded-xl mb-8" style={{
              background: '#1e1e1e',
              border: '2px solid #990000'
            }}>
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

  if (selectedQuestion) {
    return (
      <div className="h-screen question-slide-in flex flex-col" dir="rtl" style={{
        background: 'linear-gradient(to bottom, (0, 0, 0) 0%, #f8f8f2 100%)'
      }}>
        {/* Top Bar (Header) */}
        <div className="text-white p-3 flex-shrink-0" style={{
          background: 'linear-gradient(135deg, #1e1e1e 0%, #1e1e1e) 100%)',
          boxShadow: '0 4px 20px hsla(0, 79%, 50%, 0.3)'
        }}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left Side - Navigation Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSelectedQuestion(null)}
                variant="outline"
                className="px-4 py-2 rounded-full border-2 hover:scale-105 transition-transform duration-200"
                style={{
                  background: 'rgba(30, 30, 30, 0.8)',
                  color: '#f5f5f5',
                  borderColor: 'rgba(229, 9, 20, 0.4)'
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
                  background: 'rgba(30, 30, 30, 0.8)',
                  color: '#f5f5f5',
                  borderColor: 'rgba(229, 9, 20, 0.4)'
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
            <Logo size="medium" className="black" />
          </div>
        </div>

        {/* Timer Section - Centrally Placed */}
        <div className="py-3 flex-shrink-0" style={{
          background: 'linear-gradient(135deg, hsl(0, 0.80%, 25.30%) 0%, hsl(0, 0.80%, 25.30%) 100%)',
          borderTop: '2px solid hsl(0, 72.00%, 19.60%)'
        }}>
          <div className="flex justify-center items-center">
            {(isTimerActive || isTimerPaused) && !isTimeOut && (
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="text-white rounded-full p-2 hover:scale-110 transition-transform duration-200"
                  style={{
                    background: 'hsl(0, 79%, 40%)',
                    border: '2px solid hsl(0, 79%, 50%)'
                  }}
                >
                  {isTimerPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
                <div className={`flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold border-4 transition-all duration-300 ${
                  isTimerPaused
                    ? 'bg-yellow-500 text-white border-yellow-600'
                    : timeLeft <= 10 
                    ? 'bg-red-600 text-white border-red-700 animate-pulse' 
                    : 'bg-gaming-darkgrey text-gaming-offwhite border-gaming-mutedred'
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
              <div className="relative rounded-3xl p-2 h-full shadow-2xl overflow-hidden" style={{
                background: 'rgb(241, 11, 11)',
                border: '3px solid rgb(222, 33, 0)',
                boxShadow: '0 8px 32px rgba(229, 9, 20, 0.25)'
              }}>
                
                
                {/* Inner Content Container */}
                <div className="relative rounded-2xl p-4 h-full flex flex-col justify-between border-2 overflow-hidden" style={{
                  background: 'rgb(255, 245, 245)',
                  borderColor: ' #990000'
                }}>
                  {/* Category Header */}
                  <div className="text-white rounded-2xl px-4 py-2 mb-4 text-center shadow-lg" style={{
                    background: 'linear-gradient(135deg, #e50914 0%, #990000 100%)'
                  }}>
                    <h2 className="text-lg font-bold">
                      {(() => {
                        const categoryName = selectedQuestion.questionKey?.split('-')[0];
                        const category = categories?.find(cat => cat.name === categoryName);
                        return category?.displayName || categoryName || 'فئة غير معروفة';
                      })()}
                    </h2>
                  </div>

                  {/* Question Title - Arabic, centered, bold */}
                  <div className="text-center mb-3">
                    <h1 className="text-2xl font-bold leading-relaxed" style={{
                      color: 'rgb(253, 0, 0)',
                      fontFamily: 'Cairo, Arial, sans-serif',
                      textShadow: '0 2px 4px rgba(188, 166, 166, 0.1)'
                    }}>
                      {selectedQuestion.question}
                    </h1>
                  </div>
                  
                  {/* Question Image - Below question text */}
                  {selectedQuestion.imageUrl && (
  <div className="flex justify-center mb-1 flex-1 min-h-0">
    <div
      className="rounded-3xl p-2 shadow-xl border-2 max-w-full w-full max-h-[450px] overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      style={{
        background: 'linear-gradient(135deg, #333333 0%, #1e1e1e 100%)',
        borderColor: '#990000'
      }}
      onClick={() => setImagePopupOpen(true)}
    >
      <img
        src={selectedQuestion.imageUrl}
        alt="صورة السؤال"
        className="w-full h-full object-contain rounded-2xl shadow-lg"
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
                        background: 'linear-gradient(135deg, #e50914 0%, #990000 100%)',
                        boxShadow: '0 8px 24px rgba(229, 9, 20, 0.4)'
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
              background: 'linear-gradient(135deg,rgb(23, 23, 23) 0%,rgb(22, 22, 22) 100%,rgb(30, 29, 29))',
              borderColor: '#FFFFE4',
              boxShadow: '0 0 24px rgba(239, 239, 239, 0.4), 0 8px 40px rgba(225, 211, 220, 0.2)'
              }}>
                {/* Current Team Display */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold mb-2">🎯 دور الفريق الحالي</h3>
                  <div className="rounded-2xl p-3 shadow-lg border border-opacity-30" style={{
                    background: 'rgba(30, 30, 30, 0.6)',
                    borderColor: 'rgba(229, 9, 20, 0.3)'
                  }}>
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
                        className={`rounded-2xl p-2 flex justify-between items-center shadow-lg border border-opacity-30 ${
                          index === gameSession.currentTurn ? 'ring-2 ring-white' : ''
                        }`}
                        style={{
                          background: index === gameSession.currentTurn ? 'rgba(30, 30, 30, 0.8)' : 'rgba(30, 30, 30, 0.6)',
                          borderColor: 'rgba(229, 9, 20, 0.3)'
                        }}
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
                        className={`w-full text-white py-3 text-md font-bold rounded-2xl transition-all duration-300 shadow-lg border border-opacity-30 ${currentTeamHintUsed ? 'opacity-50 cursor-not-allowed' : isHintUsed ? 'opacity-75' : ''}`}
                        style={{
                          background: 'rgba(30, 30, 30, 0.6)',
                          borderColor: 'rgba(229, 9, 20, 0.3)'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(30, 30, 30, 0.8)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(30, 30, 30, 0.6)'}
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
                    className="w-full text-white py-3 text-md font-bold rounded-2xl transition-all duration-300 shadow-lg border border-opacity-30"
                    style={{
                      background: 'rgba(30, 30, 30, 0.6)',
                      borderColor: 'rgba(229, 9, 20, 0.3)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(30, 30, 30, 0.8)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(30, 30, 30, 0.6)'}
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
            background: 'linear-gradient(135deg, #1e1e1e 0%, #000000 100%)'
          }}>
            <div className="max-w-7xl mx-auto">
              <div className="rounded-2xl p-4 hint-reveal border-3" style={{
                background: '#333333',
                borderColor: '#e50914',
                borderStyle: 'dashed'
              }}>
                <div className="text-white rounded-xl px-4 py-2 inline-block mb-3 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #e50914 0%, #990000 100%)'
                }}>
                  <h3 className="font-bold text-md">💡 تلميح</h3>
                </div>
                <p className="text-md font-medium leading-relaxed" style={{
                  fontFamily: 'Cairo, Arial, sans-serif',
                  color: '#f5f5f5'
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
              <div className="relative rounded-3xl shadow-2xl overflow-hidden" style={{
                background: '#1e1e1e'
              }}>
                {/* Close Button */}
                <button
                  onClick={() => setImagePopupOpen(false)}
                  className="absolute top-4 right-4 z-10 rounded-full p-2 shadow-lg transition-all duration-200"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    color: '#f5f5f5'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(30, 30, 30, 1)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(30, 30, 30, 0.9)'}
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
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(123, 0, 0, 0.8) 100%)'
              }}
            />
            
            {/* Modal Content - Creative Card Design */}
<div className="relative max-w-2xl w-full h-[85vh] flex flex-col" dir="rtl">
              {/* Main Card Container */}
              <div className="relative rounded-3xl shadow-2xl overflow-hidden transform scale-100 animate-in duration-300 h-full flex flex-col" style={{
                background: '#1e1e1e',
                border: '4px solid #e50914',
                boxShadow: '0 25px 50px rgba(229, 9, 20, 0.4), 0 0 0 1px rgba(229, 9, 20, 0.2)'
              }}>
                
                {/* Top Header with Close Button */}
                <div className="relative p-2 text-center flex-shrink-0" style={{
                  background: 'linear-gradient(135deg, #e50914 0%, #990000 50%, #e50914 100%)'
                }}>
                  {/* Close Button */}
                  <button
                    onClick={() => setShowAnswer(false)}
                    className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: 'rgba(30, 30, 30, 0.6)',
                      border: '2px solid rgba(229, 9, 20, 0.3)'
                    }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Header Content */}
                  <div className="text-white">
                    <div className="text-2xl">🎯</div>
                    <h2 className="text-lg font-bold">الإجابة الصحيحة</h2>
                  </div>
                </div>

                {/* Answer Display Section */}
                <div className="p-3 text-center flex-shrink-0">
                  <div className="mb-3 p-3 rounded-2xl" style={{
                    background: 'linear-gradient(135deg, #000000 0%, #1e1e1e 100%)',
                    border: '3px solid #990000',
                    boxShadow: 'inset 0 2px 8px rgba(229, 9, 20, 0.2)'
                  }}>
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2" style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      }}>
                        ✓
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#f5f5f5' }}>الجواب</span>
                    </div>
                    <p className="text-xl font-bold leading-relaxed" style={{
                      fontFamily: 'Cairo, Arial, sans-serif',
                      color: '#f5f5f5'
                    }}>
                      {selectedQuestion.answer}
                    </p>
                  </div>
                  
                  {selectedQuestion.explanation && (
                    <div className="mb-2 p-2 rounded-xl" style={{
                      background: 'linear-gradient(135deg, #333333 0%, #1e1e1e 100%)',
                      border: '2px solid #990000'
                    }}>
                      <div className="flex items-center mb-1">
                        <div className="text-sm mr-1">💡</div>
                        <span className="text-sm font-bold" style={{ color: '#f5f5f5' }}>توضيح</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{
                        fontFamily: 'Cairo, Arial, sans-serif',
                        color: '#f5f5f5'
                      }}>
                        {selectedQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Team Selection Section */}
                <div className="px-3 pb-1 flex-1 min-h-0 overflow-y-auto">
                  <div className="grid gap-2">
                    {gameSession.teams.map((team: string, index: number) => {
                      const questionKey = selectedQuestion.questionKey;
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
                          className="p-1.5 rounded-xl transition-all duration-300 hover:scale-105 transform shadow-lg group"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: '2px solid #10b981',
                            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                          }}
                          disabled={markTeamCorrectMutation.isPending}
                        >
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-1 group-hover:scale-110 transition-transform" style={{
                                background: 'rgba(30, 30, 30, 0.8)'
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
                <div className="p-2 space-y-1 flex-shrink-0" style={{
                  background: 'linear-gradient(135deg, #1e1e1e 0%, #000000 100%)',
                  borderTop: '2px solid #990000'
                }}>
                  <button
                    onClick={() => {
                      handleSkipQuestion();
                      setShowAnswer(false);
                    }}
                    className="w-full p-1.5 rounded-xl transition-all duration-300 hover:scale-105 transform font-bold text-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #e50914 0%, #990000 100%)',
                      border: '2px solid #e50914'
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
                      background: '#333333',
                      color: '#f5f5f5',
                      borderColor: '#990000'
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

  return (
    <div className="min-h-screen flex flex-col page-transition" style={{
      background: 'linear-gradient(180deg,rgb(235, 230, 230) 0%,rgb(245, 239, 239) 100%)'
    }}>
      {/* Header - Top navigation with scores */}
      <header className="p-4" style={{
        background: '#1e1e1e',
        borderBottom: '2px solidrgb(0, 0, 0)',
        boxShadow: '0 4px 20px rgba(12, 12, 12, 0.3)'
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Add Logo */}
            <Logo size="medium" className="mr-4" />
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="border-2 hover:scale-105 transition-transform duration-200"
              style={{
                background: '#e50914',
                color: '#f5f5f5',
                borderColor: '#990000'
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-gaming-offwhite">
                دور: <span className="font-bold px-3 py-1 rounded-full" style={{
                  background: '#e50914',
                  color: '#f5f5f5',
                  border: '2px solid #990000'
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
                  background: 'transparent',
                  color: '#e50914',
                  borderColor: '#e50914'
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
                background: '#1e1e1e',
                borderColor: '#990000',
                color: '#f5f5f5',
                boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)'
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
                      background: 'transparent',
                      color: '#e50914',
                      borderColor: '#e50914'
                    }}
                    title="تقليل النقاط"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="text-xl font-bold min-w-[40px]" style={{ color: '#f5f5f5' }}>
                    {gameSession.teamScores[index] || 0}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustScoreMutation.mutate({ teamIndex: index, scoreChange: 50 })}
                    disabled={adjustScoreMutation.isPending}
                    className="border hover:scale-110 transition-transform duration-200 p-1 h-6 w-6"
                    style={{
                      background: 'transparent',
                      color: '#e50914',
                      borderColor: '#e50914'
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
                  background: '#1e1e1e',
                  borderColor: '#990000',
                  boxShadow: '0 8px 32px rgba(229, 9, 20, 0.3)'
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
                          background: '#333333',
                          color: '#666666'
                        } : {
                          background: 'linear-gradient(135deg, rgb(97, 248, 198), #059669 100%)',
                          color: '#f5f5f5',
                          border: '2px solid #10b981'
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
                          background: '#333333',
                          color: '#666666'
                        } : {
                          background: 'linear-gradient(135deg,rgb(255, 140, 0) 0%,rgb(232, 179, 95) 100%)',
                          color: '#f5f5f5',
                          border: '2px solid rgb(232, 172, 83)'
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
                          background: '#333333',
                          color: '#666666'
                        } : {
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                          color: '#f5f5f5',
                          border: '2px solid #dc2626'
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
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gaming-darkgrey to-gaming-black flex items-center justify-center">
                            <div className="text-4xl text-white">
                              {CATEGORY_ICONS[category.name] || CATEGORY_ICONS[category.displayName] || "📚"}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Category Name - Full width bottom bar */}
                      <div className="w-40 text-white py-3 px-3 rounded-b-3xl text-center" style={{
                        background: 'linear-gradient(135deg, #e50914 0%, #990000 100%)'
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
                          background: '#333333',
                          color: '#666666'
                        } : {
                          background: 'linear-gradient(135deg,rgb(97, 248, 198) 0%, #059669 100%)',
                          color: '#f5f5f5',
                          border: '2px solid #10b981'
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
                          background: '#333333',
                          color: '#666666'
                        } : {
                          background: 'linear-gradient(135deg, rgb(255, 140, 0) 0%,rgb(232, 179, 95) 100%)',
                          color: '#f5f5f5',
                          border: '2px solid rgb(239, 183, 85)'
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
                          background: '#333333',
                          color: '#666666'
                        } : {
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                          color: '#f5f5f5',
                          border: '2px solid #dc2626'
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
