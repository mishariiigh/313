import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Users, User, Plus, Trash2, Play } from "lucide-react";

const setupSchema = z.object({
  gameType: z.enum(["single", "team"]),
  teams: z.array(z.string().min(1, "اسم الفريق مطلوب")).min(2, "يجب وجود فريقين على الأقل"),
});

export default function GameSetupPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [gameType, setGameType] = useState("single");
  const [teams, setTeams] = useState(["الفريق الأول", "الفريق الثاني"]);
  const [newTeamName, setNewTeamName] = useState("");

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

  const startGameMutation = useMutation({
    mutationFn: async (data: { gameType: string; teams: string[] }) => {
      const response = await apiRequest("POST", "/api/games/start", data);
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

  const handleAddTeam = () => {
    if (newTeamName.trim() && teams.length < 6) {
      setTeams([...teams, newTeamName.trim()]);
      setNewTeamName("");
    }
  };

  const handleRemoveTeam = (index: number) => {
    if (teams.length > 2) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const handleStartGame = () => {
    if (user?.availableGames <= 0) {
      toast({
        title: "لا توجد ألعاب متاحة",
        description: "يرجى شراء ألعاب إضافية للمتابعة",
        variant: "destructive",
      });
      return;
    }

    const gameData = {
      gameType,
      teams: gameType === "team" ? teams : []
    };

    startGameMutation.mutate(gameData);
  };

  const handleBack = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="luxury-card mx-4 mt-4 p-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <button className="luxury-button-secondary p-2 ml-4" onClick={handleBack}>
              <ArrowRight className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-luxury-green-dark">إعداد لعبة جديدة</h1>
              <p className="text-muted-foreground">اختر نوع اللعبة وإعداد الفرق</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="luxury-card p-8">
          <div className="space-y-8">
            {/* Game Type Selection */}
            <div>
              <Label className="text-lg font-semibold text-luxury-green-dark mb-4 block">نوع اللعبة</Label>
              <RadioGroup value={gameType} onValueChange={setGameType}>
                <div className="luxury-card p-4 border-2 border-luxury-green-light">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <User className="h-5 w-5 ml-2 text-luxury-green" />
                        <div>
                          <span className="font-semibold text-luxury-green-dark">لعبة فردية</span>
                          <p className="text-sm text-muted-foreground">لعبة تقليدية بسؤال واحد في كل مرة</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
                
                <div className="luxury-card p-4 border-2 border-luxury-green">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <RadioGroupItem value="team" id="team" />
                    <Label htmlFor="team" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 ml-2 text-luxury-green" />
                        <div>
                          <span className="font-semibold text-luxury-green-dark">لعبة جماعية</span>
                          <p className="text-sm text-muted-foreground">لوحة أسئلة للفرق مع نظام نقاط</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Team Setup (only for team games) */}
            {gameType === "team" && (
              <div>
                <Label className="text-lg font-semibold text-luxury-green-dark mb-4 block">إعداد الفرق</Label>
                
                <div className="space-y-4">
                  {teams.map((team, index) => (
                    <div key={index} className="flex items-center space-x-reverse space-x-3 luxury-card p-3">
                      <span className="flex-1 text-luxury-green-dark font-medium">{team}</span>
                      {teams.length > 2 && (
                        <button
                          onClick={() => handleRemoveTeam(index)}
                          className="luxury-button-secondary p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {teams.length < 6 && (
                    <div className="flex items-center space-x-reverse space-x-3">
                      <Input
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="اسم الفريق الجديد"
                        className="flex-1"
                      />
                      <button
                        onClick={handleAddTeam}
                        className="luxury-button-secondary p-2"
                        disabled={!newTeamName.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Start Game Button */}
            <button
              onClick={handleStartGame}
              disabled={startGameMutation.isPending || user?.availableGames <= 0}
              className="luxury-button w-full py-4 text-lg"
            >
              {startGameMutation.isPending ? (
                <div className="luxury-spinner mx-auto" />
              ) : (
                <>
                  <Play className="ml-2 h-6 w-6" />
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