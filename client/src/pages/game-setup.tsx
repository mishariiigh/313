import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Play, Users, Edit2, Check, X } from "lucide-react";

export default function GameSetupPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [teams, setTeams] = useState<string[]>(["الفريق الأول", "الفريق الثاني"]);
  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  const [tempTeamName, setTempTeamName] = useState("");

  const startGameMutation = useMutation({
    mutationFn: async () => {
      const gameData = {
        gameType: "team",
        teams,
      };
      const response = await apiRequest("POST", "/api/games/start", gameData);
      return response.json();
    },
    onSuccess: (data) => {
      const gameId = data.gameSession.id;
      setLocation(`/game/${gameId}`);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في بدء اللعبة",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleEditTeam = (index: number) => {
    setEditingTeam(index);
    setTempTeamName(teams[index]);
  };

  const handleSaveTeam = () => {
    if (tempTeamName.trim() && editingTeam !== null) {
      const newTeams = [...teams];
      newTeams[editingTeam] = tempTeamName.trim();
      setTeams(newTeams);
      setEditingTeam(null);
      setTempTeamName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingTeam(null);
    setTempTeamName("");
  };

  const handleStartGame = () => {
    startGameMutation.mutate();
  };

  // Redirect if not logged in
  if (!user) {
    setLocation("/auth");
    return null;
  }

  // Check if user has available games
  if (user.availableGames <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-luxury-green-dark mb-4">لا توجد ألعاب متاحة</h2>
          <p className="text-muted-foreground mb-6">تحتاج إلى شراء ألعاب إضافية للمتابعة</p>
          <Button onClick={() => setLocation("/checkout")} className="luxury-button">
            شراء ألعاب
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen page-transition">
      {/* Header */}
      <header className="luxury-card mx-4 mt-4 p-6 mb-6 board-transition">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <button className="luxury-button-secondary p-2 ml-4" onClick={handleBack}>
              <ArrowRight className="h-5 w-5 text-luxury-green-dark" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-luxury-green-dark">إعداد لعبة جديدة</h1>
              <p className="text-muted-foreground">أدخل أسماء الفريقين</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="luxury-card p-8 question-slide-in">
          <div className="space-y-8">
            {/* Teams Setup */}
            <div className="question-slide-in">
              <Label className="text-lg font-semibold text-luxury-green-dark mb-4 block flex items-center">
                <Users className="h-5 w-5 ml-2 text-luxury-green" />
                إعداد الفريقين
              </Label>
              
              <div className="space-y-4">
                {teams.map((team, index) => (
                  <div key={index} className="flex items-center space-x-reverse space-x-3 luxury-card p-4 hint-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                    {editingTeam === index ? (
                      <>
                        <Input
                          value={tempTeamName}
                          onChange={(e) => setTempTeamName(e.target.value)}
                          className="flex-1"
                          placeholder="اسم الفريق"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveTeam}
                          className="luxury-button-secondary p-2"
                          disabled={!tempTeamName.trim()}
                        >
                          <Check className="h-4 w-4 text-luxury-green" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="luxury-button-secondary p-2"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-luxury-green-dark font-medium">{team}</span>
                        <button
                          onClick={() => handleEditTeam(index)}
                          className="luxury-button-secondary p-2"
                        >
                          <Edit2 className="h-4 w-4 text-luxury-green" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Info */}
            <div className="luxury-card p-6 bg-luxury-green-light answer-reveal">
              <h3 className="text-lg font-semibold text-luxury-green-dark mb-2">معلومات اللعبة</h3>
              <ul className="text-sm text-luxury-green-dark space-y-1">
                <li>• 36 سؤالاً موزعة على 6 فئات</li>
                <li>• 6 أسئلة لكل فئة</li>
                <li>• نظام تناوب الأدوار بين الفريقين</li>
                <li>• إمكانية عرض التلميحات والإجابات</li>
              </ul>
            </div>

            {/* Start Game Button */}
            <button
              onClick={handleStartGame}
              disabled={startGameMutation.isPending || editingTeam !== null}
              className="luxury-button w-full py-4 text-lg question-card-flip"
            >
              {startGameMutation.isPending ? (
                <div className="luxury-spinner mx-auto" />
              ) : (
                <>
                  <Play className="ml-2 h-6 w-6 text-white" />
                  بدء اللعبة ({user?.availableGames || 0} ألعاب متاحة)
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}