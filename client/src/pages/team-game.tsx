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

  // Question view - New Layout Structure
  if (selectedQuestion) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-50 to-orange-50 question-slide-in flex flex-col" dir="rtl">
        {/* Top Bar (Header) */}
        <div className="bg-red-600 text-white p-3 flex-shrink-0">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left Side - Navigation Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSelectedQuestion(null)}
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-4 py-2 rounded-full"
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
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-4 py-2 rounded-full"
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
        <div className="bg-gray-800 py-3 flex-shrink-0">
          <div className="flex justify-center items-center">
            {isTimerActive && !isTimeOut && (
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2"
                >
                  {isTimerActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <div className={`flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold border-4 transition-all duration-300 ${
                  timeLeft <= 10 
                    ? 'bg-red-600 text-white border-red-700 animate-pulse' 
                    : 'bg-white text-gray-800 border-gray-300'
                }`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <span className="text-white text-sm">
                  {timeLeft <= 10 ? 'الوقت ينفد!' : 'الوقت المتبقي'}
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
              <div className="relative bg-white rounded-3xl p-6 h-full shadow-2xl overflow-hidden" style={{
                border: '3px solid #dc2626',
                boxShadow: '0 8px 32px rgba(220, 38, 38, 0.15)'
              }}>
                {/* Decorative Triangle Border Effect */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      transparent 0px,
                      transparent 8px,
                      #dc2626 8px,
                      #dc2626 10px,
                      transparent 10px,
                      transparent 18px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent 0px,
                      transparent 8px,
                      #dc2626 8px,
                      #dc2626 10px,
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
                <div className="relative bg-white rounded-2xl p-4 h-full flex flex-col justify-between border-2 border-red-100 overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl px-4 py-2 mb-4 text-center shadow-lg">
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
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-2 shadow-xl border-2 border-gray-200 max-w-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
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
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 text-lg font-bold rounded-3xl transition-all duration-300 shadow-xl transform hover:scale-105"
                    >
                      🔍 إظهار الإجابة
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel (Right Side) - Red Buttons */}
            <div className="w-64">
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl shadow-2xl p-4 h-full border-2 border-red-500">
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
          <div className="p-3 bg-gray-100 flex-shrink-0">
            <div className="max-w-7xl mx-auto">
              <div className="bg-blue-50 border-3 border-blue-400 rounded-2xl p-4 hint-reveal" style={{
                borderStyle: 'dashed'
              }}>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl px-4 py-2 inline-block mb-3 shadow-lg">
                  <h3 className="font-bold text-md">💡 تلميح</h3>
                </div>
                <p className="text-blue-800 text-md font-medium leading-relaxed" style={{
                  fontFamily: 'Cairo, Arial, sans-serif'
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

        {/* Answer Modal - Popup with Background Blur */}
        {showAnswer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background Blur Overlay */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAnswer(false)}
            />
            
            {/* Modal Content - Styled Like Website */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 mx-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto" dir="rtl" style={{
              border: '3px solid #dc2626',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.1)'
            }}>
              {/* Decorative Triangle Border Effect */}
              <div className="absolute inset-0 rounded-3xl" style={{
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    transparent 8px,
                    #dc2626 8px,
                    #dc2626 10px,
                    transparent 10px,
                    transparent 18px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent 0px,
                    transparent 8px,
                    #dc2626 8px,
                    #dc2626 10px,
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
              <div className="relative bg-white rounded-2xl p-6 border-2 border-red-200">
                {/* Answer Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 mb-6 text-center">
                  <h2 className="text-2xl font-bold mb-2">✅ الإجابة الصحيحة</h2>
                </div>

                {/* Answer Content */}
                <div className="text-center mb-8">
                  <p className="text-gray-800 text-3xl font-bold mb-4 leading-relaxed" style={{
                    fontFamily: 'Cairo, Arial, sans-serif'
                  }}>
                    {selectedQuestion.answer}
                  </p>
                  
                  {selectedQuestion.explanation && (
                    <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                      <p className="text-gray-700 text-lg leading-relaxed" style={{
                        fontFamily: 'Cairo, Arial, sans-serif'
                      }}>
                        {selectedQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Team Selection Buttons */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
                    أي فريق أجاب بشكل صحيح؟
                  </h3>
                  <div className="space-y-3">
                    {gameSession.teams.map((team: string, index: number) => {
                      const questionKey = (selectedQuestion as any).questionKey;
                      const points = questionKey ? (() => {
                        const idx = parseInt(questionKey.split('-')[1]);
                        return idx < 2 ? 200 : idx < 4 ? 400 : 600;
                      })() : getPointsForDifficulty(selectedQuestion.difficulty);
                      
                      return (
                        <Button
                          key={index}
                          onClick={() => {
                            handleTeamCorrect(index);
                            setShowAnswer(false);
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg"
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
                </div>

                {/* Control Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      handleSkipQuestion();
                      setShowAnswer(false);
                    }}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg"
                    disabled={skipQuestionMutation.isPending}
                  >
                    لم يجب أي فريق بشكل صحيح
                  </Button>
                  
                  <Button
                    onClick={() => setShowAnswer(false)}
                    variant="outline"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 py-4 text-lg font-bold rounded-2xl transition-all duration-300"
                  >
                    العودة للسؤال
                  </Button>
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