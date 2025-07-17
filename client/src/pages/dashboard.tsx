import React from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Gamepad2, Trophy, Star, Play, ShoppingCart, Home, Settings, LogOut, Plus } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: historyData } = useQuery({
    queryKey: ["/api/games/history"],
    enabled: !!user,
  });

  const { data: activeGameData } = useQuery({
    queryKey: ["/api/games/active"],
    enabled: !!user,
  });

  const startGameMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/games/start");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation(`/game/${data.gameSession.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في بدء اللعبة",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleStartGame = () => {
    if (user?.availableGames <= 0) {
      toast({
        title: "لا توجد ألعاب متاحة",
        description: "يرجى شراء ألعاب إضافية للمتابعة",
        variant: "destructive",
      });
      return;
    }
    setLocation("/game-setup");
  };

  const handlePurchaseGames = () => {
    setLocation("/checkout");
  };

  const addGamesMutation = useMutation({
    mutationFn: async (gameCount: number) => {
      const response = await apiRequest("POST", "/api/add-games", { gameCount });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "تم إضافة الألعاب بنجاح",
        description: "تم إضافة الألعاب إلى حسابك",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إضافة الألعاب",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleAddGames = (gameCount: number) => {
    addGamesMutation.mutate(gameCount);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen page-transition">
      {/* Creative Header */}
      <header className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-red-100 to-red-50 opacity-80"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-16 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-12 right-24 w-24 h-24 bg-red-300 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute bottom-8 left-1/3 w-20 h-20 bg-red-200 rounded-full opacity-10"></div>
        </div>

        <div className="relative z-10 luxury-container">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-reverse space-x-6">
              {/* Enhanced Logo */}
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Brain className="text-white h-8 w-8" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Star className="text-white h-3 w-3" />
                </div>
              </div>
              
              {/* Enhanced Title */}
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                  منصة الألعاب الثقافية
                </h1>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <p className="text-red-600 font-medium">مرحباً، {user?.name}</p>
                  <Trophy className="h-4 w-4 text-red-500" />
                </div>
              </div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-reverse space-x-3">
              {user?.isAdmin && (
                <button
                  className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => setLocation("/admin")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <Settings className="h-5 w-5 ml-2" />
                    الإدارة
                  </div>
                </button>
              )}
              <button
                className="group relative px-6 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-red-50"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 ml-2" />
                  خروج
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-300 via-red-500 to-red-300"></div>
      </header>

      {/* Main Content */}
      <main className="luxury-container py-12">
        {/* Hero Section */}
        <div className="hero-section rounded-2xl mb-12 relative">
          <div className="relative z-10 text-center">
            <h2 className="luxury-section-header">اكتشف عالم المعرفة العربية</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تحدى نفسك مع مجموعة متنوعة من الأسئلة الثقافية والعلمية في اللغة العربية
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="luxury-stats-card glow pulse-luxury question-slide-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-luxury-green rounded-2xl flex items-center justify-center shadow-luxury floating">
                <Gamepad2 className="text-luxury-cream h-8 w-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-luxury-green-dark mb-2">الألعاب المتاحة</h3>
            <p className="text-4xl font-bold text-gradient">{user?.availableGames || 0}</p>
          </div>

          <div className="luxury-stats-card hint-reveal">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-luxury-gold rounded-2xl flex items-center justify-center shadow-luxury floating question-category-pulse">
                <Trophy className="text-luxury-green-dark h-8 w-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-luxury-green-dark mb-2">الألعاب المكتملة</h3>
            <p className="text-4xl font-bold text-gradient team-score-update">{historyData?.gameSessions?.length || 0}</p>
          </div>

          <div className="luxury-stats-card answer-reveal">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-luxury-green-dark rounded-2xl flex items-center justify-center shadow-luxury floating question-category-pulse">
                <Star className="text-luxury-gold h-8 w-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-luxury-green-dark mb-2">النقاط الإجمالية</h3>
            <p className="text-4xl font-bold text-gradient team-score-update">
              {historyData?.gameSessions?.reduce((total: number, session: any) => total + session.score, 0) || 0}
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Continue Game Card (only show if active game exists) */}
          {activeGameData?.activeSession && (
            <div className="luxury-card p-10 text-center hint-reveal border-2 border-luxury-gold">
              <div className="w-24 h-24 bg-luxury-gold rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-luxury floating question-category-pulse">
                <Play className="text-luxury-green-dark h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-luxury-green-dark mb-4">متابعة اللعبة</h3>
              <p className="text-muted-foreground mb-8 text-lg">لديك لعبة نشطة، تابع من حيث توقفت</p>
              <button 
                className="luxury-button w-full text-lg py-4 glow question-card-flip"
                onClick={() => setLocation(`/game/${activeGameData.activeSession.id}`)}
              >
                <Play className="ml-2 h-6 w-6" />
                متابعة اللعبة
              </button>
              <p className="text-sm text-muted-foreground mt-4">
                نوع اللعبة: {activeGameData.activeSession.gameType === "team" ? "فريقين" : "فردية"}
              </p>
            </div>
          )}

          {/* Start New Game Card */}
          <div className="luxury-card p-10 text-center hint-reveal">
            <div className="w-24 h-24 bg-luxury-green rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-luxury floating question-category-pulse">
              <Play className="text-luxury-cream h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-luxury-green-dark mb-4">بدء لعبة جديدة</h3>
            <p className="text-muted-foreground mb-8 text-lg">ابدأ جلسة جديدة بـ 36 سؤالاً متنوعاً عبر 6 فئات مختلفة</p>
            <button 
              className="luxury-button w-full text-lg py-4 glow question-card-flip"
              onClick={handleStartGame}
              disabled={user?.availableGames <= 0}
            >
              <Gamepad2 className="ml-2 h-6 w-6" />
              بدء اللعبة الآن
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              {user?.availableGames || 0} ألعاب متاحة
            </p>
          </div>

          {/* Purchase Games Card */}
          <div className="luxury-card p-10 text-center answer-reveal">
            <div className="w-24 h-24 bg-luxury-gold rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-luxury floating question-category-pulse">
              <ShoppingCart className="text-luxury-green-dark h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-luxury-green-dark mb-4">شراء ألعاب إضافية</h3>
            <p className="text-muted-foreground mb-8 text-lg">احصل على المزيد من الألعاب لتستمتع مع أصدقائك</p>
            
            {/* Pricing Options */}
            <div className="space-y-4 mb-8">
              <div className="luxury-card p-4 border-2 border-luxury-green-light">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <span className="font-semibold text-luxury-green-dark">لعبة واحدة</span>
                    <span className="text-sm text-muted-foreground block">36 سؤالاً</span>
                  </div>
                  <span className="font-bold text-luxury-green text-xl">$1.99</span>
                </div>
              </div>
              <div className="luxury-card p-4 border-2 border-luxury-green bg-luxury-green-light">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <span className="font-semibold text-luxury-green-dark">5 ألعاب</span>
                    <span className="text-sm text-luxury-green-dark font-medium block">وفر 10%</span>
                  </div>
                  <span className="font-bold text-luxury-green-dark text-xl">$8.99</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                className="luxury-button-secondary w-full text-lg py-4 question-card-flip"
                onClick={handlePurchaseGames}
              >
                <ShoppingCart className="ml-2 h-6 w-6" />
                شراء الآن
              </button>
              
              <div className="text-center text-sm text-muted-foreground">أو</div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="luxury-button py-3 text-sm question-card-flip"
                  onClick={() => handleAddGames(1)}
                  disabled={addGamesMutation.isPending}
                >
                  {addGamesMutation.isPending ? (
                    <div className="luxury-spinner mx-auto scale-75" />
                  ) : (
                    <>
                      <Plus className="ml-1 h-4 w-4" />
                      إضافة لعبة
                    </>
                  )}
                </button>
                
                <button 
                  className="luxury-button py-3 text-sm question-card-flip"
                  onClick={() => handleAddGames(5)}
                  disabled={addGamesMutation.isPending}
                >
                  {addGamesMutation.isPending ? (
                    <div className="luxury-spinner mx-auto scale-75" />
                  ) : (
                    <>
                      <Plus className="ml-1 h-4 w-4" />
                      إضافة 5 ألعاب
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Games History */}
        {historyData?.gameSessions && historyData.gameSessions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>سجل الألعاب الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historyData.gameSessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between py-4 border-b border-neutral-100 last:border-b-0">
                    <div className="flex items-center space-x-reverse space-x-4">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <Trophy className="text-secondary h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">لعبة ثقافية متنوعة</p>
                        <p className="text-sm text-neutral-600">
                          مكتملة في {new Date(session.completedAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-sm text-neutral-500">النقاط</span>
                      <p className="font-bold text-secondary">{session.score}/36</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
