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
import { Plus, Edit, Trash2, Users, MessageSquare, ArrowRight, Upload, Image as ImageIcon } from "lucide-react";
import { useAuthRedirect } from "@/lib/auth";
import { ImageUpload } from "@/components/ui/image-upload";
import { useLocation } from "wouter";
import type { Question, Category, Coupon } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isLoading } = useAuthRedirect();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("questions");
  
  // Search and filter states
  const [questionSearch, setQuestionSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [couponSearch, setCouponSearch] = useState("");
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
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

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

  // Mutations
  const createQuestionMutation = useMutation({
    mutationFn: async (data: typeof questionForm) => {
      const response = await apiRequest("POST", "/api/admin/questions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setQuestionForm({ question: "", answer: "", category: "", difficulty: "سهل", hint: "", explanation: "", imageUrl: "" });
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] }); // Refresh questions for filter
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] }); // Refresh questions for filter
      setEditingCategory(null);
      setCategoryForm({ name: "", displayName: "", description: "", logoUrl: "" });
      toast({ title: "تم تحديث الفئة بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في تحديث الفئة", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/categories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] }); // Refresh questions for filter
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
    setQuestionForm({ question: "", answer: "", category: "", difficulty: "سهل", hint: "", explanation: "", imageUrl: "" });
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">لوحة تحكم المدير</h1>
          <p className="text-gray-600">إدارة الأسئلة والفئات والكوبونات</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
          </TabsList>

          <TabsContent value="questions" className="mt-6">
            {/* Search and Filter Bar */}
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
              {/* Add Question Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingQuestion ? "تعديل السؤال" : "إضافة سؤال جديد"}
                  </CardTitle>
                  <CardDescription>
                    {editingQuestion ? "تعديل بيانات السؤال المحدد" : "أضف سؤالاً جديداً إلى قاعدة البيانات"}
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
                      value={questionForm.answer}
                      onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
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
                        {categories?.categories?.map((cat: Category) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.displayName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">الصعوبة</Label>
                    <Select value={questionForm.difficulty} onValueChange={(value) => setQuestionForm({ ...questionForm, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="سهل">سهل</SelectItem>
                        <SelectItem value="متوسط">متوسط</SelectItem>
                        <SelectItem value="صعب">صعب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hint">التلميح</Label>
                    <Input
                      id="hint"
                      value={questionForm.hint}
                      onChange={(e) => setQuestionForm({ ...questionForm, hint: e.target.value })}
                      placeholder="تلميح للسؤال (اختياري)"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="explanation">الشرح</Label>
                    <Textarea
                      id="explanation"
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                      placeholder="شرح الإجابة (اختياري)"
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
                  <div className="flex gap-2">
                    <Button
                      onClick={handleQuestionSubmit}
                      disabled={
                        (editingQuestion ? updateQuestionMutation.isPending : createQuestionMutation.isPending) ||
                        !questionForm.question ||
                        !questionForm.answer ||
                        !questionForm.category
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

              {/* Questions List */}
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
                            {question.imageUrl && (
                              <div className="flex-shrink-0">
                                <img
                                  src={question.imageUrl}
                                  alt={question.question}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
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
            {/* Search Bar */}
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
              {/* Add Category Form */}
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

              {/* Categories List */}
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
                                      onClick={() => deleteCategoryMutation.mutate(category.id)}
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
            {/* Search Bar */}
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
              {/* Add Coupon Form */}
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
                      {couponForm.discountType === "percentage" ? "نسبة الخصم (%)" : "مبلغ الخصم (بالقروش)"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={couponForm.discountValue}
                      onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                      placeholder={couponForm.discountType === "percentage" ? "20" : "500"}
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

              {/* Coupons List */}
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
                                  : `${coupon.discountValue / 100}$ خصم`}
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
        </Tabs>
      </div>
    </div>
  );
}