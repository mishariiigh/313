import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Gamepad2, Trophy, Star, Play, ShoppingCart, Home, Settings, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if not logged in
  if (!user) {
    setLocation("/auth");
    return null;
  }

  const { data: historyData } = useQuery({
    queryKey: ["/api/games/history"],
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
    if (user.availableGames <= 0) {
      toast({
        title: "لا توجد ألعاب متاحة",
        description: "يرجى شراء ألعاب إضافية للمتابعة",
        variant: "destructive",
      });
      return;
    }
    startGameMutation.mutate();
  };

  const handlePurchaseGames = () => {
    setLocation("/checkout");
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                <Brain className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-800">منصة الألعاب الثقافية</h1>
                <p className="text-sm text-neutral-600">مرحباً، {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-4">
              {user.isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/admin")}
                >
                  <Settings className="h-4 w-4 ml-2" />
                  الإدارة
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="text-primary h-6 w-6" />
                  </div>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-neutral-600">الألعاب المتاحة</p>
                  <p className="text-2xl font-bold text-neutral-900">{user.availableGames}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Trophy className="text-secondary h-6 w-6" />
                  </div>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-neutral-600">الألعاب المكتملة</p>
                  <p className="text-2xl font-bold text-neutral-900">{historyData?.gameSessions?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Star className="text-yellow-500 h-6 w-6" />
                  </div>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-neutral-600">النقاط الإجمالية</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {historyData?.gameSessions?.reduce((total: number, session: any) => total + session.score, 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Start New Game Card */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">بدء لعبة جديدة</h3>
                <p className="text-neutral-600 mb-6">ابدأ جلسة جديدة بـ 36 سؤالاً متنوعاً عبر 6 فئات مختلفة</p>
                <Button 
                  className="w-full" 
                  onClick={handleStartGame}
                  disabled={user.availableGames <= 0 || startGameMutation.isPending}
                >
                  <Gamepad2 className="ml-2 h-4 w-4" />
                  بدء اللعبة الآن
                </Button>
                <p className="text-sm text-neutral-500 mt-2">
                  {user.availableGames} ألعاب متاحة
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Games Card */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="text-secondary h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">شراء ألعاب إضافية</h3>
                <p className="text-neutral-600 mb-6">احصل على المزيد من الألعاب لتستمتع مع أصدقائك</p>
                
                {/* Pricing Options */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div className="text-right">
                      <span className="font-medium">لعبة واحدة</span>
                      <span className="text-sm text-neutral-500 block">36 سؤالاً</span>
                    </div>
                    <span className="font-bold text-primary">$1.99</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border-2 border-secondary rounded-lg bg-secondary/5">
                    <div className="text-right">
                      <span className="font-medium">5 ألعاب</span>
                      <span className="text-sm text-secondary font-medium block">وفر 10%</span>
                    </div>
                    <span className="font-bold text-secondary">$8.99</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90" 
                  onClick={handlePurchaseGames}
                >
                  <ShoppingCart className="ml-2 h-4 w-4" />
                  شراء الآن
                </Button>
              </div>
            </CardContent>
          </Card>
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
