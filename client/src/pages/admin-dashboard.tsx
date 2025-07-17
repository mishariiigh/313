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
import { Plus, Edit, Trash2, Users, MessageSquare } from "lucide-react";
import { useAuthRedirect } from "@/lib/auth";
import type { Question, Category, Coupon } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isLoading } = useAuthRedirect();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("questions");

  // States for forms
  const [questionForm, setQuestionForm] = useState({
    question: "",
    answer: "",
    category: "",
    difficulty: "سهل",
    hint: "",
    explanation: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    displayName: "",
    description: "",
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
      setQuestionForm({ question: "", answer: "", category: "", difficulty: "سهل", hint: "", explanation: "" });
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
      setCategoryForm({ name: "", displayName: "", description: "" });
      toast({ title: "تم إنشاء الفئة بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ في إنشاء الفئة", description: error.message, variant: "destructive" });
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Question Form */}
              <Card>
                <CardHeader>
                  <CardTitle>إضافة سؤال جديد</CardTitle>
                  <CardDescription>أضف سؤالاً جديداً إلى قاعدة البيانات</CardDescription>
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
                  <Button
                    onClick={() => createQuestionMutation.mutate(questionForm)}
                    disabled={createQuestionMutation.isPending || !questionForm.question || !questionForm.answer}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة السؤال
                  </Button>
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
                      {questions?.questions?.map((question: Question) => (
                        <div key={question.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
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
                                onClick={() => setEditingQuestion(question)}
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
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Category Form */}
              <Card>
                <CardHeader>
                  <CardTitle>إضافة فئة جديدة</CardTitle>
                  <CardDescription>أضف فئة جديدة للأسئلة</CardDescription>
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
                  <Button
                    onClick={() => createCategoryMutation.mutate(categoryForm)}
                    disabled={createCategoryMutation.isPending || !categoryForm.name || !categoryForm.displayName}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة الفئة
                  </Button>
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
                      {categories?.categories?.map((category: Category) => (
                        <div key={category.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{category.displayName}</h3>
                              <p className="text-sm text-gray-600">{category.name}</p>
                              {category.description && (
                                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                              )}
                            </div>
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                              {category.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="mt-6">
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
                      {coupons?.coupons?.map((coupon: Coupon) => (
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
                      ))}
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