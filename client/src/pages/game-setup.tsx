import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Play, Users, Edit2, Check, X, BookOpen } from "lucide-react";
import { Category } from "@/../../shared/schema";

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
};

export default function GameSetupPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [teams, setTeams] = useState<string[]>(["الفريق الأول", "الفريق الثاني"]);
  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  const [tempTeamName, setTempTeamName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch categories from admin management
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    enabled: !!user,
  });

  const startGameMutation = useMutation({
    mutationFn: async () => {
      const gameData = {
        gameType: "team",
        teams,
        categories: selectedCategories,
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

  const categories = categoriesData?.categories || [];
  const requiredCategoriesCount = Math.min(6, categories.length);

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(name => name !== categoryName);
      } else {
        // Limit to maximum 6 categories
        if (prev.length >= 6) {
          toast({
            title: "الحد الأقصى للفئات",
            description: "يمكن اختيار 6 فئات كحد أقصى",
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, categoryName];
      }
    });
  };

  const handleStartGame = () => {
    // Validate that exactly 6 categories are selected
    if (selectedCategories.length !== 6) {
      toast({
        title: "يجب اختيار 6 فئات",
        description: "يرجى اختيار 6 فئات بالضبط لبدء اللعبة",
        variant: "destructive",
      });
      return;
    }

    // Validate that team names are not empty
    if (teams.some(team => !team.trim())) {
      toast({
        title: "يجب إدخال أسماء الفريقين",
        description: "يرجى إدخال أسماء صحيحة للفريقين",
        variant: "destructive",
      });
      return;
    }

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
              <h1 className="text-xl font-bold text-luxury-green-dark">إعداد لعبة جديدة - 313</h1>
              <p className="text-muted-foreground">أدخل أسماء الفريقين</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="luxury-card p-8 question-slide-in">
          <div className="space-y-8">
            {/* Category Selection */}
            <div className="question-slide-in">
              <Label className="text-lg font-semibold text-luxury-green-dark mb-4 block flex items-center">
                <BookOpen className="h-5 w-5 ml-2 text-luxury-green" />
                اختيار الفئات (يجب اختيار 6 فئات بالضبط)
              </Label>
              
              {categoriesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="luxury-spinner" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  لا توجد فئات متاحة حالياً
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category, index) => {
                      const icon = CATEGORY_ICONS[category.name] || "📝";
                      return (
                        <div key={category.id} className="flex items-center space-x-reverse space-x-3 luxury-card p-4 hint-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() => handleCategoryToggle(category.name)}
                            className="data-[state=checked]:bg-luxury-green data-[state=checked]:border-luxury-green"
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="flex items-center space-x-reverse space-x-2 cursor-pointer flex-1"
                          >
                            <span className="text-2xl">{icon}</span>
                            <div>
                              <span className="text-luxury-green-dark font-medium">{category.displayName}</span>
                              {category.description && (
                                <p className="text-sm text-gray-600">{category.description}</p>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-3 text-sm text-center">
                    <span className={`font-medium ${selectedCategories.length === 6 ? 'text-luxury-green' : 'text-orange-600'}`}>
                      تم اختيار {selectedCategories.length} من 6 فئات
                    </span>
                  </div>
                </>
              )}
            </div>

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
                <li>• 6 أسئلة لكل فئة مع 3 مستويات صعوبة</li>
                <li>• نظام تناوب الأدوار بين الفريقين</li>
                <li>• إمكانية عرض التلميحات والإجابات</li>
                <li>• مؤقت 60 ثانية لكل سؤال</li>
              </ul>
            </div>

            {/* Requirements Check */}
            <div className="luxury-card p-4 bg-orange-50 border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">المتطلبات قبل بدء اللعبة:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li className={`flex items-center ${selectedCategories.length === 6 ? 'text-green-700' : 'text-orange-700'}`}>
                  <span className="ml-2">{selectedCategories.length === 6 ? '✓' : '○'}</span>
                  اختيار 6 فئات بالضبط ({selectedCategories.length}/6)
                </li>
                <li className={`flex items-center ${teams.every(team => team.trim()) ? 'text-green-700' : 'text-orange-700'}`}>
                  <span className="ml-2">{teams.every(team => team.trim()) ? '✓' : '○'}</span>
                  إدخال أسماء الفريقين
                </li>
              </ul>
            </div>

            {/* Start Game Button */}
            <button
              onClick={handleStartGame}
              disabled={
                startGameMutation.isPending || 
                editingTeam !== null || 
                categoriesLoading ||
                selectedCategories.length !== 6 || 
                teams.some(team => !team.trim())
              }
              className={`w-full py-4 text-lg question-card-flip transition-all duration-300 ${
                selectedCategories.length === 6 && teams.every(team => team.trim()) && editingTeam === null && !categoriesLoading
                  ? 'luxury-button' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
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