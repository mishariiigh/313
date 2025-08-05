import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users, MessageSquare, ArrowRight, Upload, Image as ImageIcon, BarChart } from "lucide-react";
import { useAuthRedirect } from "@/lib/auth";
import { ImageUpload } from "@/components/ui/image-upload";
import { useLocation } from "wouter";
import type { Question, Category, Coupon, GamePackage } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isLoading } = useAuthRedirect();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("analytics");

  // Helper function to format currency in KWD
  const formatKWD = (amountInCents: number) => {
    return `${(amountInCents / 1000).toFixed(3)} د.ك`;
  };

  // Search and filter states
  const [questionSearch, setQuestionSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [couponSearch, setCouponSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState("all");
  const [questionDifficultyFilter, setQuestionDifficultyFilter] = useState("all");

  // States for forms
  const [questionForm, setQuestionForm] = useState({
    question: "",
    answer: "",
    category: "",
    difficulty: "سهل",
    hint: "",
    explanation: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    displayName: "",
    description: "",
    logoUrl: "",
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxUsage: "",
    expiresAt: "",
  });

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [gamePackageForm, setGamePackageForm] = useState({
    name: "",
    description: "",
    gameCount: "",
    priceInCents: "",
    sortOrder: "",
    isActive: true,
  });
  const [editingGamePackage, setEditingGamePackage] = useState<GamePackage | null>(null);

  const [userForm, setUserForm] = useState({
    email: "",
    phoneNumber: "",
    name: "",
    password: "",
    availableGames: "",
    isAdmin: false,
  });
  const [editingUser, setEditingUser] = useState<any>(null);

  // Queries
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["/api/admin/questions"],
    enabled: user?.isAdmin,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/admin/categories"],
    enabled: user?.isAdmin,
  });

  const { data: coupons, isLoading: couponsLoading } = useQuery({
    queryKey: ["/api/admin/coupons"],
    enabled: user?.isAdmin,
  });

  const { data: gamePackages, isLoading: gamePackagesLoading } = useQuery({
    queryKey: ["/api/admin/game-packages"],
    enabled: user?.isAdmin,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.isAdmin,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/sales-analytics"],
    enabled: user?.isAdmin,
  });

  // Mutations
  const createQuestionMutation = useMutation({
    mutationFn: async (data: typeof questionForm) => {
      const response = await apiRequest("POST", "/api/admin/questions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setQuestionForm({ question: "", answer: "", category: "", difficulty: "سهل", hint: "", explanation: "", imageUrl: "", videoUrl: "" });
      toast({ title: "تم إنشاء السؤال بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في إنشاء السؤال", description: error.message, variant: "destructive" });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Question> }) => {
      const response = await apiRequest("PUT", `/api/admin/questions/${data.id}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setEditingQuestion(null);
      toast({ title: "تم تحديث السؤال بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في تحديث السؤال", description: error.message, variant: "destructive" });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/questions/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      toast({ title: "تم حذف السؤال بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في حذف السؤال", description: error.message, variant: "destructive" });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof categoryForm) => {
      const response = await apiRequest("POST", "/api/admin/categories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setCategoryForm({ name: "", displayName: "", description: "", logoUrl: "" });
      toast({ title: "تم إنشاء الفئة بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في إنشاء الفئة", description: error.message, variant: "destructive" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { id: number; updates: typeof categoryForm }) => {
      const response = await apiRequest("PUT", `/api/admin/categories/${data.id}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setEditingCategory(null);
      setCategoryForm({ name: "", displayName: "", description: "", logoUrl: "" });
      toast({ title: "تم تحديث الفئة بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في تحديث الفئة", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/categories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      toast({ title: "تم حذف الفئة بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في حذف الفئة", description: error.message, variant: "destructive" });
    },
  });

  const createCouponMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/coupons", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      setCouponForm({ code: "", discountType: "percentage", discountValue: "", maxUsage: "", expiresAt: "" });
      toast({ title: "تم إنشاء الكوبون بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في إنشاء الكوبون", description: error.message, variant: "destructive" });
    },
  });

  const toggleCouponMutation = useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/coupons/${data.id}`, { isActive: data.isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({ title: "تم تحديث حالة الكوبون" });
    },
  });

  const createGamePackageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/game-packages", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/game-packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/game-packages"] });
      setGamePackageForm({ name: "", description: "", gameCount: "", priceInCents: "", sortOrder: "", isActive: true });
      toast({ title: "تم إنشاء باقة الألعاب بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في إنشاء باقة الألعاب", description: error.message, variant: "destructive" });
    },
  });

  const updateGamePackageMutation = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      const response = await apiRequest("PUT", `/api/admin/game-packages/${data.id}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/game-packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/game-packages"] });
      setEditingGamePackage(null);
      setGamePackageForm({ name: "", description: "", gameCount: "", priceInCents: "", sortOrder: "", isActive: true });
      toast({ title: "تم تحديث باقة الألعاب بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في تحديث باقة الألعاب", description: error.message, variant: "destructive" });
    },
  });

  const deleteGamePackageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/game-packages/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/game-packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/game-packages"] });
      toast({ title: "تم حذف باقة الألعاب بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في حذف باقة الألعاب", description: error.message, variant: "destructive" });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/users", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setUserForm({ email: "", phoneNumber: "", name: "", password: "", availableGames: "", isAdmin: false });
      toast({ title: "تم إنشاء المستخدم بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في إنشاء المستخدم", description: error.message, variant: "destructive" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      const response = await apiRequest("PUT", `/api/admin/users/${data.id}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingUser(null);
      setUserForm({ email: "", phoneNumber: "", name: "", password: "", availableGames: "", isAdmin: false });
      toast({ title: "تم تحديث المستخدم بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في تحديث المستخدم", description: error.message, variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "تم حذف المستخدم بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في حذف المستخدم", description: error.message, variant: "destructive" });
    },
  });

  // Helper functions for filtering and searching
  const filteredQuestions = questions?.questions?.filter((question: Question) => {
    const matchesSearch = question.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
                         question.answer.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesCategory = !questionCategoryFilter || questionCategoryFilter === "all" || question.category === questionCategoryFilter;
    const matchesDifficulty = !questionDifficultyFilter || questionDifficultyFilter === "all" || question.difficulty === questionDifficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  }) || [];

  const filteredCategories = categories?.categories?.filter((category: Category) => {
    return category.displayName.toLowerCase().includes(categorySearch.toLowerCase()) ||
           category.name.toLowerCase().includes(categorySearch.toLowerCase());
  }) || [];

  const filteredCoupons = coupons?.coupons?.filter((coupon: Coupon) => {
    return coupon.code.toLowerCase().includes(couponSearch.toLowerCase());
  }) || [];

  const filteredUsers = users?.users?.filter((user: any) => {
    return user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
           user.name.toLowerCase().includes(userSearch.toLowerCase());
  }) || [];

  // Helper function to count questions per category and difficulty
  const getQuestionCount = (category: string, difficulty?: string) => {
    if (!questions?.questions) return 0;
    return questions.questions.filter((q: Question) => {
      const matchesCategory = q.category === category;
      const matchesDifficulty = !difficulty || q.difficulty === difficulty;
      return matchesCategory && matchesDifficulty;
    }).length;
  };

  // Helper function to check if we can add more questions to a category/difficulty
  const canAddQuestion = (category: string, difficulty: string) => {
    if (!category || !difficulty) return false;
    const currentCount = getQuestionCount(category, difficulty);
    return currentCount < 2; // Max 2 questions per difficulty per category
  };

  // Helper function to get category status
  const getCategoryStatus = (category: string) => {
    const easyCount = getQuestionCount(category, "سهل");
    const mediumCount = getQuestionCount(category, "متوسط");
    const hardCount = getQuestionCount(category, "صعب");
    const totalCount = easyCount + mediumCount + hardCount;

    return {
      easy: easyCount,
      medium: mediumCount,
      hard: hardCount,
      total: totalCount,
      isComplete: totalCount === 6 && easyCount === 2 && mediumCount === 2 && hardCount === 2
    };
  };

  // Helper functions for editing
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      question: question.question,
      answer: question.answer,
      category: question.category,
      difficulty: question.difficulty,
      hint: question.hint || "",
      explanation: question.explanation || "",
      imageUrl: question.imageUrl || "",
      videoUrl: question.videoUrl || "",
    });
  };

  const handleQuestionSubmit = () => {
    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion.id, updates: questionForm });
    } else {
      createQuestionMutation.mutate(questionForm);
    }
  };

  const handleCancelQuestionEdit = () => {
    setEditingQuestion(null);
    setQuestionForm({ question: "", answer: "", category: "", difficulty: "سهل", hint: "", explanation: "", imageUrl: "", videoUrl: "" });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      displayName: category.displayName,
      description: category.description || "",
      logoUrl: category.logoUrl || "",
    });
  };

  const handleCategorySubmit = () => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, updates: categoryForm });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", displayName: "", description: "", logoUrl: "" });
  };

  const handleEditGamePackage = (gamePackage: GamePackage) => {
    setEditingGamePackage(gamePackage);
    setGamePackageForm({
      name: gamePackage.name,
      description: gamePackage.description,
      gameCount: gamePackage.gameCount.toString(),
      priceInCents: gamePackage.priceInCents.toString(),
      sortOrder: gamePackage.sortOrder.toString(),
      isActive: gamePackage.isActive,
    });
  };

  const handleGamePackageSubmit = () => {
    if (editingGamePackage) {
      updateGamePackageMutation.mutate({ 
        id: editingGamePackage.id, 
        updates: {
          ...gamePackageForm,
          gameCount: parseInt(gamePackageForm.gameCount),
          priceInCents: parseInt(gamePackageForm.priceInCents),
          sortOrder: parseInt(gamePackageForm.sortOrder) || 0,
        }
      });
    } else {
      createGamePackageMutation.mutate({
        ...gamePackageForm,
        gameCount: parseInt(gamePackageForm.gameCount),
        priceInCents: parseInt(gamePackageForm.priceInCents),
        sortOrder: parseInt(gamePackageForm.sortOrder) || 0,
      });
    }
  };

  const handleCancelGamePackageEdit = () => {
    setEditingGamePackage(null);
    setGamePackageForm({ name: "", description: "", gameCount: "", priceInCents: "", sortOrder: "", isActive: true });
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      name: user.name,
      password: "",
      availableGames: user.availableGames.toString(),
      isAdmin: user.isAdmin,
    });
  };

  const handleUserSubmit = () => {
    if (editingUser) {
      const updates: any = {
        email: userForm.email,
        phoneNumber: userForm.phoneNumber,
        name: userForm.name,
        availableGames: parseInt(userForm.availableGames),
        isAdmin: userForm.isAdmin,
      };
      if (userForm.password && userForm.password.trim() !== "") {
        updates.password = userForm.password;
      }
      updateUserMutation.mutate({ id: editingUser.id, updates });
    } else {
      createUserMutation.mutate({
        ...userForm,
        availableGames: parseInt(userForm.availableGames),
      });
    }
  };

  const handleCancelUserEdit = () => {
    setEditingUser(null);
    setUserForm({ email: "", phoneNumber: "", name: "", password: "", availableGames: "", isAdmin: false });
  };

  // Video upload handler
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: "خطأ في نوع الملف",
        description: "يجب أن يكون الملف فيديو (MP4، MOV، AVI، إلخ)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (allow up to 50MB for videos)
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSizeInBytes) {
      toast({
        title: "حجم الملف كبير جداً",
        description: `حجم الملف ${(file.size / 1024 / 1024).toFixed(2)} ميجابايت. الحد الأقصى المسموح 50 ميجابايت`,
        variant: "destructive"
      });
      return;
    }

    // Check video duration (max 60 seconds)
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > 60) {
        toast({
          title: "مدة الفيديو طويلة جداً",
          description: `مدة الفيديو ${Math.round(video.duration)} ثانية. الحد الأقصى المسموح 60 ثانية`,
          variant: "destructive"
        });
        return;
      }

      try {
        toast({
          title: "جاري رفع الفيديو...",
          description: "يرجى الانتظار، قد يستغرق هذا بعض الوقت",
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'video');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'فشل في رفع الفيديو');
        }

        const result = await response.json();
        setQuestionForm({ ...questionForm, videoUrl: result.videoUrl });

        toast({
          title: "تم رفع الفيديو بنجاح",
          description: `تم رفع الفيديو (${(file.size / 1024 / 1024).toFixed(1)} ميجابايت، ${Math.round(video.duration)} ثانية) إلى Firebase Storage`,
        });

      } catch (error: any) {
        console.error('Video upload error:', error);
        toast({
          title: "خطأ في رفع الفيديو",
          description: error.message || "حدث خطأ أثناء رفع الفيديو",
          variant: "destructive"
        });
      }
    };

    video.src = URL.createObjectURL(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-spinner" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">غير مصرح</h1>
          <p className="text-gray-600">ليس لديك صلاحيات الوصول لهذه الصفحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-reverse space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="flex items-center space-x-reverse space-x-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة للوحة الرئيسية
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">لوحة تحكم المدير - 313</h1>
          <p className="text-gray-600">إدارة الأسئلة والفئات والكوبونات</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">
              <BarChart className="w-4 h-4 mr-2" />
              تحليلات المبيعات
            </TabsTrigger>
            <TabsTrigger value="questions">
              <MessageSquare className="w-4 h-4 mr-2" />
              الأسئلة
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Users className="w-4 h-4 mr-2" />
              الفئات
            </TabsTrigger>
            <TabsTrigger value="coupons">
              <Plus className="w-4 h-4 mr-2" />
              الكوبونات
            </TabsTrigger>
            <TabsTrigger value="packages">
              <Upload className="w-4 h-4 mr-2" />
              باقات الألعاب
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              المستخدمين
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            {analyticsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600">إجمالي الإيرادات</p>
                          <p className="text-2xl font-bold text-blue-800">{formatKWD(analytics?.totalRevenue || 0)}</p>
                        </div>
                        <BarChart className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600">إجمالي المبيعات</p>
                          <p className="text-2xl font-bold text-green-800">{analytics?.totalSales || 0}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600">متوسط قيمة الطلب</p>
                          <p className="text-2xl font-bold text-purple-800">{formatKWD(analytics?.averageOrderValue || 0)}</p>
                        </div>
                        <ArrowRight className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600">باقات الألعاب الأكثر مبيعاً</p>
                          <p className="text-2xl font-bold text-orange-800">{analytics?.topGamePackages?.[0]?.name || 'لا يوجد'}</p>
                        </div>
                        <Upload className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="question-search">البحث في الأسئلة</Label>
                  <Input
                    id="question-search"
                    placeholder="ابحث في الأسئلة والأجوبة..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category-filter">فلترة بالفئة</Label>
                  <Select value={questionCategoryFilter} onValueChange={setQuestionCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفئات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفئات</SelectItem>
                      {categories?.categories?.map((cat: Category) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.displayName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty-filter">فلترة بالصعوبة</Label>
                  <Select value={questionDifficultyFilter} onValueChange={setQuestionDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المستويات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المستويات</SelectItem>
                      <SelectItem value="سهل">سهل</SelectItem>
                      <SelectItem value="متوسط">متوسط</SelectItem>
                      <SelectItem value="صعب">صعب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingQuestion ? "تعديل السؤال" : "إضافة سؤال جديد"}
                  </CardTitle>
                  <CardDescription>
                    {editingQuestion ? "تعديل بيانات السؤال المحدد" : "أضف سؤالاً جديداً للفئة المحددة"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="question">السؤال</Label>
                    <Textarea
                      id="question"
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      placeholder="اكتب السؤال هنا..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="answer">الإجابة</Label>
                    <Input
                      id="answer"
                      value={questionForm.answer}                      onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                      placeholder="الإجابة الصحيحة"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">الفئة</Label>
                    <Select value={questionForm.category} onValueChange={(value) => setQuestionForm({ ...questionForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.categories?.map((cat: Category) => {
                          const status = getCategoryStatus(cat.name);
                          return (
                            <SelectItem key={cat.id} value={cat.name}>
                              <div className="flex items-center justify-between w-full">
                                <span>{cat.displayName}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({status.total}/6)
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">الصعوبة والنقاط</Label>
                    <Select value={questionForm.difficulty} onValueChange={(value) => setQuestionForm({ ...questionForm, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="سهل">سهل (200 نقطة)</SelectItem>
                        <SelectItem value="متوسط">متوسط (400 نقطة)</SelectItem>
                        <SelectItem value="صعب">صعب (600 نقطة)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hint">التلميح (مطلوب)</Label>
                    <Input
                      id="hint"
                      value={questionForm.hint}
                      onChange={(e) => setQuestionForm({ ...questionForm, hint: e.target.value })}
                      placeholder="تلميح مساعد للسؤال"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="explanation">الوصف/الشرح (اختياري)</Label>
                    <Textarea
                      id="explanation"
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                      placeholder="شرح أو وصف إضافي للسؤال"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>صورة السؤال (اختياري)</Label>
                    <ImageUpload
                      value={questionForm.imageUrl}
                      onChange={(url) => setQuestionForm({ ...questionForm, imageUrl: url })}
                      size="md"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="video">فيديو السؤال (اختياري - حد أقصى 60 ثانية)</Label>
                    <div className="mt-1">
                      <input
                        type="file"
                        id="video"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-red-50 file:text-red-700
                          hover:file:bg-red-100"
                      />
                      {questionForm.videoUrl && (
                        <div className="mt-2">
                          <video 
                            src={questionForm.videoUrl} 
                            controls
                            className="max-w-full h-40 object-contain rounded border"
                          >
                            المتصفح الخاص بك لا يدعم تشغيل الفيديو.
                          </video>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setQuestionForm({ ...questionForm, videoUrl: "" })}
                          >
                            إزالة الفيديو
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      الحد الأقصى: 60 ثانية، 50 ميجابايت. سيتم عرض الفيديو للمستخدمين بعد تقديم الإجابة.
                    </p>
                  </div>

                  {questionForm.category && questionForm.difficulty && !editingQuestion && 
                   !canAddQuestion(questionForm.category, questionForm.difficulty) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <strong>تحذير:</strong> لقد تم الوصول للحد الأقصى من الأسئلة لهذه الفئة والصعوبة (2/2). 
                      لا يمكن إضافة المزيد من الأسئلة.
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleQuestionSubmit}
                      disabled={
                        (editingQuestion ? updateQuestionMutation.isPending : createQuestionMutation.isPending) ||
                        !questionForm.question ||
                        !questionForm.answer ||
                        !questionForm.category ||
                        !questionForm.hint ||
                        (!editingQuestion && !canAddQuestion(questionForm.category, questionForm.difficulty))
                      }
                      className="flex-1"
                    >
                      {editingQuestion ? (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          تحديث السؤال
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          إضافة السؤال
                        </>
                      )}
                    </Button>
                    {editingQuestion && (
                      <Button
                        variant="outline"
                        onClick={handleCancelQuestionEdit}
                        className="flex-1"
                      >
                        إلغاء
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الأسئلة المتاحة</CardTitle>
                  <CardDescription>جميع الأسئلة في قاعدة البيانات</CardDescription>
                </CardHeader>
                <CardContent>
                  {questionsLoading ? (
                    <div className="text-center">جاري التحميل...</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredQuestions.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          لا توجد أسئلة تطابق البحث
                        </div>
                      ) : (
                        filteredQuestions.map((question: Question) => (
                        <div key={question.id} className="p-4 border rounded-lg">
                          <div className="flex items-start space-x-reverse space-x-4">
                            {(question.imageUrl || question.videoUrl) && (
                              <div className="flex-shrink-0">
                                {question.imageUrl && (
                                  <img
                                    src={question.imageUrl}
                                    alt={question.question}
                                    className="w-16 h-16 object-cover rounded-lg border"
                                  />
                                )}
                                {question.videoUrl && (
                                  <div className="relative">
                                    <video
                                      src={question.videoUrl}
                                      className="w-16 h-16 object-cover rounded-lg border"
                                      muted
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                                      <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-l-2 border-l-gray-800 border-t-1 border-t-transparent border-b-1 border-b-transparent ml-0.5"></div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{question.question}</p>
                                  <p className="text-sm text-gray-600 mt-1">الإجابة: {question.answer}</p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="secondary">{question.category}</Badge>
                                    <Badge variant="outline">{question.difficulty}</Badge>
                                    {question.imageUrl && (
                                      <Badge variant="outline" className="text-xs">
                                        📷 صورة
                                      </Badge>
                                    )}
                                    {question.videoUrl && (
                                      <Badge variant="outline" className="text-xs">
                                        🎥 فيديو
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditQuestion(question)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteQuestionMutation.mutate(question.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div>
                <Label htmlFor="category-search">البحث في الفئات</Label>
                <Input
                  id="category-search"
                  placeholder="ابحث في أسماء الفئات..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
                  </CardTitle>
                  <CardDescription>
                    {editingCategory ? "تعديل بيانات الفئة المحددة" : "أضف فئة جديدة للأسئلة"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">اسم الفئة (بالإنجليزية)</Label>
                    <Input
                      id="name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="history"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayName">اسم الفئة (بالعربية)</Label>
                    <Input
                      id="displayName"
                      value={categoryForm.displayName}
                      onChange={(e) => setCategoryForm({ ...categoryForm, displayName: e.target.value })}
                      placeholder="التاريخ"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="وصف الفئة (اختياري)"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>شعار الفئة</Label>
                    <ImageUpload
                      value={categoryForm.logoUrl}
                      onChange={(url) => setCategoryForm({ ...categoryForm, logoUrl: url })}
                      size="sm"
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCategorySubmit}
                      disabled={
                        (editingCategory ? updateCategoryMutation.isPending : createCategoryMutation.isPending) ||
                        !categoryForm.name ||
                        !categoryForm.displayName
                      }
                      className="flex-1"
                    >
                      {editingCategory ? (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          تحديث الفئة
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          إضافة الفئة
                        </>
                      )}
                    </Button>
                    {editingCategory && (
                      <Button
                        variant="outline"
                        onClick={handleCancelCategoryEdit}
                        className="flex-1"
                      >
                        إلغاء
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الفئات المتاحة</CardTitle>
                  <CardDescription>جميع فئات الأسئلة</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoriesLoading ? (
                    <div className="text-center">جاري التحميل...</div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCategories.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          لا توجد فئات تطابق البحث
                        </div>
                      ) : (
                        filteredCategories.map((category: Category) => (
                        <div key={category.id} className="p-4 border rounded-lg">
                          <div className="flex items-start space-x-reverse space-x-4">
                            <div className="flex-shrink-0">
                              {category.logoUrl ? (
                                <img
                                  src={category.logoUrl}
                                  alt={category.displayName}
                                  className="w-12 h-12 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{category.displayName}</h3>
                                  <p className="text-sm text-gray-600">{category.name}</p>
                                  {category.description && (
                                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={category.isActive ? "default" : "secondary"}>
                                    {category.isActive ? "نشط" : "غير نشط"}
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditCategory(category)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        console.log('Deleting category with ID:', category.id, 'Type:', typeof category.id);
                                        deleteCategoryMutation.mutate(category.id);
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="mt-6">
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div>
                <Label htmlFor="coupon-search">البحث في الكوبونات</Label>
                <Input
                  id="coupon-search"
                  placeholder="ابحث في أكواد الكوبونات..."
                  value={couponSearch}
                  onChange={(e) => setCouponSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إضافة كوبون جديد</CardTitle>
                  <CardDescription>أضف كوبون خصم جديد</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="code">كود الكوبون</Label>
                    <Input
                      id="code"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      placeholder="SAVE20"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountType">نوع الخصم</Label>
                    <Select value={couponForm.discountType} onValueChange={(value) => setCouponForm({ ...couponForm, discountType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discountValue">
                      {couponForm.discountType === "percentage" ? "نسبة الخصم (%)" : "مبلغ الخصم (بالفلس)"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={couponForm.discountValue}
                      onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                      placeholder={couponForm.discountType === "percentage" ? "20" : "500 (0.500 د.ك)"}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxUsage">الحد الأقصى للاستخدام</Label>
                    <Input
                      id="maxUsage"
                      type="number"
                      value={couponForm.maxUsage}
                      onChange={(e) => setCouponForm({ ...couponForm, maxUsage: e.target.value })}
                      placeholder="100 (اتركه فارغاً لاستخدام غير محدود)"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiresAt">تاريخ انتهاء الصلاحية</Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={couponForm.expiresAt}
                      onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={() => createCouponMutation.mutate({
                      ...couponForm,
                      discountValue: parseInt(couponForm.discountValue),
                      maxUsage: couponForm.maxUsage ? parseInt(couponForm.maxUsage) : null,
                      expiresAt: couponForm.expiresAt ? new Date(couponForm.expiresAt).toISOString() : null,
                    })}
                    disabled={createCouponMutation.isPending || !couponForm.code || !couponForm.discountValue}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة الكوبون
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الكوبونات المتاحة</CardTitle>
                  <CardDescription>جميع كوبونات الخصم</CardDescription>
                </CardHeader>
                <CardContent>
                  {couponsLoading ? (
                    <div className="text-center">جاري التحميل...</div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCoupons.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          لا توجد كوبونات تطابق البحث
                        </div>
                      ) : (
                        filteredCoupons.map((coupon: Coupon) => (
                        <div key={coupon.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{coupon.code}</h3>
                              <p className="text-sm text-gray-600">
                                {coupon.discountType === "percentage" 
                                  ? `${coupon.discountValue}% خصم` 
                                  : `${(coupon.discountValue / 100).toFixed(3)} د.ك خصم`}
                              </p>
                              <p className="text-sm text-gray-500">
                                الاستخدام: {coupon.usageCount} / {coupon.maxUsage || "غير محدود"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={coupon.isActive ? "default" : "secondary"}>
                                {coupon.isActive ? "نشط" : "غير نشط"}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleCouponMutation.mutate({ id: coupon.id, isActive: !coupon.isActive })}
                              >
                                {coupon.isActive ? "إلغاء" : "تفعيل"}
                              </Button>
                            </div>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إضافة باقة جديدة</CardTitle>
                  <CardDescription>إنشاء باقة ألعاب جديدة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="packageName">اسم الباقة</Label>
                      <Input
                        id="packageName"
                        value={gamePackageForm.name}
                        onChange={(e) => setGamePackageForm({ ...gamePackageForm, name: e.target.value })}
                        placeholder="مثل: باقة المبتدئين"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gameCount">عدد الألعاب</Label>
                      <Input
                        id="gameCount"
                        type="number"
                        value={gamePackageForm.gameCount}
                        onChange={(e) => setGamePackageForm({ ...gamePackageForm, gameCount: e.target.value })}
                        placeholder="مثل: 5"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="packageDescription">وصف الباقة</Label>
                    <Input
                      id="packageDescription"
                      value={gamePackageForm.description}
                      onChange={(e) => setGamePackageForm({ ...gamePackageForm, description: e.target.value })}
                      placeholder="وصف مختصر عن الباقة"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priceInCents">السعر (بالفلس)</Label>
                      <Input
                        id="priceInCents"
                        type="number"
                        value={gamePackageForm.priceInCents}
                        onChange={(e) => setGamePackageForm({ ...gamePackageForm, priceInCents: e.target.value })}
                        placeholder="مثل: 1900 (يعني 1.900 د.ك)"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sortOrder">ترتيب العرض</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={gamePackageForm.sortOrder}
                        onChange={(e) => setGamePackageForm({ ...gamePackageForm, sortOrder: e.target.value })}
                        placeholder="مثل: 1"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={gamePackageForm.isActive}
                      onChange={(e) => setGamePackageForm({ ...gamePackageForm, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="isActive">الباقة نشطة</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleGamePackageSubmit}
                      disabled={createGamePackageMutation.isPending || updateGamePackageMutation.isPending || !gamePackageForm.name || !gamePackageForm.gameCount || !gamePackageForm.priceInCents}
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {editingGamePackage ? "تحديث الباقة" : "إضافة الباقة"}
                    </Button>
                    {editingGamePackage && (
                      <Button onClick={handleCancelGamePackageEdit} variant="outline">
                        إلغاء
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>باقات الألعاب المتاحة</CardTitle>
                  <CardDescription>جميع باقات الألعاب</CardDescription>
                </CardHeader>
                <CardContent>
                  {gamePackagesLoading ? (
                    <div className="text-center">جاري التحميل...</div>
                  ) : (
                    <div className="space-y-4">
                      {!gamePackages?.packages || gamePackages.packages.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          لا توجد باقات ألعاب حالياً
                        </div>
                      ) : (
                        gamePackages.packages.map((gamePackage: GamePackage) => (
                          <div key={gamePackage.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{gamePackage.name}</h3>
                                <p className="text-sm text-gray-600">{gamePackage.description}</p>
                                <p className="text-sm text-gray-500">
                                  {gamePackage.gameCount} ألعاب - {formatKWD(gamePackage.priceInCents)}
                                </p>
                                <p className="text-sm text-gray-400">
                                  الترتيب: {gamePackage.sortOrder}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={gamePackage.isActive ? "default" : "secondary"}>
                                  {gamePackage.isActive ? "نشط" : "غير نشط"}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditGamePackage(gamePackage)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteGamePackageMutation.mutate(gamePackage.id)}
                                  disabled={deleteGamePackageMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user-search">البحث في المستخدمين</Label>
                  <Input
                    id="user-search"
                    placeholder="ابحث بالبريد الإلكتروني أو الاسم..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    إجمالي المستخدمين: {filteredUsers.length}
                  </div>
                </div>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingUser ? "تحديث المستخدم" : "إضافة مستخدم جديد"}
                </CardTitle>
                <CardDescription>
                  {editingUser ? "قم بتحديث بيانات المستخدم المحدد" : "أضف مستخدم جديد للنظام"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-email">البريد الإلكتروني</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="user@example.com"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-phone">رقم الهاتف</Label>
                    <Input
                      id="user-phone"
                      type="tel"
                      placeholder="+965 1234567"
                      value={userForm.phoneNumber}
                      onChange={(e) => setUserForm({ ...userForm, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-name">الاسم</Label>
                    <Input
                      id="user-name"
                      placeholder="اسم المستخدم"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-password">
                      كلمة المرور {editingUser && "(اتركه فارغة لعدم التغيير)"}
                    </Label>
                    <Input
                      id="user-password"
                      type="password"
                      placeholder="كلمة المرور"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-games">عدد الألعاب المتاحة</Label>
                    <Input
                      id="user-games"
                      type="number"
                      placeholder="0"
                      value={userForm.availableGames}
                      onChange={(e) => setUserForm({ ...userForm, availableGames: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="user-admin"
                      checked={userForm.isAdmin}
                      onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="user-admin">مدير النظام</Label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleUserSubmit}
                    disabled={createUserMutation.isPending || updateUserMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {editingUser ? "تحديث المستخدم" : "إضافة المستخدم"}
                  </Button>
                  {editingUser && (
                    <Button
                      variant="outline"
                      onClick={handleCancelUserEdit}
                    >
                      إلغاء التحديث
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المستخدمون المسجلون</CardTitle>
                <CardDescription>
                  قائمة بجميع المستخدمين في النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="luxury-spinner" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        لم يتم العثور على مستخدمين
                      </div>
                    ) : (
                      filteredUsers.map((user: any) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-reverse space-x-2">
                              <h3 className="font-medium text-gray-900">{user.name}</h3>
                              {user.isAdmin && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  مدير
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">{user.phoneNumber || 'لا يوجد رقم هاتف'}</p>
                            <p className="text-sm text-gray-500">

                              الألعاب المتاحة: {user.availableGames}
                            </p>
                            <p className="text-sm text-gray-400">
                              تاريخ التسجيل: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                                                          </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف المستخدم ${user.name}؟`)) {
                                  deleteUserMutation.mutate(user.id);
                                }
                              }}
                              disabled={deleteUserMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}