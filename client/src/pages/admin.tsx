import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, HelpCircle, Gamepad2, DollarSign, Plus, Edit, Trash2, LogOut } from "lucide-react";
import { getCategoryColor, getDifficultyColor } from "@/lib/game";

const questionSchema = z.object({
  question: z.string().min(10, "السؤال يجب أن يكون 10 أحرف على الأقل"),
  answer: z.string().min(2, "الإجابة يجب أن تكون حرفين على الأقل"),
  category: z.string().min(1, "يجب اختيار فئة"),
  difficulty: z.string().min(1, "يجب اختيار مستوى الصعوبة"),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const categories = [
  "التاريخ",
  "الجغرافيا", 
  "الدين",
  "الرياضة",
  "الثقافة العامة",
  "العلوم"
];

const difficulties = ["سهل", "متوسط", "صعب"];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  // Redirect if not logged in or not admin
  if (!user) {
    setLocation("/auth");
    return null;
  }

  if (!user.isAdmin) {
    setLocation("/dashboard");
    return null;
  }

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: questionsData } = useQuery({
    queryKey: ["/api/admin/questions", categoryFilter, difficultyFilter],
  });

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      difficulty: "",
      hint: "",
      explanation: "",
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof questionSchema>) => {
      const response = await apiRequest("POST", "/api/admin/questions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "تم إضافة السؤال",
        description: "تم إضافة السؤال بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إضافة السؤال",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof questionSchema> }) => {
      const response = await apiRequest("PUT", `/api/admin/questions/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setEditingQuestion(null);
      form.reset();
      toast({
        title: "تم تحديث السؤال",
        description: "تم تحديث السؤال بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تحديث السؤال",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "تم حذف السؤال",
        description: "تم حذف السؤال بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في حذف السؤال",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const seedFirebaseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/seed-firebase");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم رفع البيانات بنجاح",
        description: `تم رفع ${data.total} عنصر إلى Firebase بنجاح`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في رفع البيانات",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddQuestion = (data: z.infer<typeof questionSchema>) => {
    createQuestionMutation.mutate(data);
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    form.reset({
      question: question.question,
      answer: question.answer,
      category: question.category,
      difficulty: question.difficulty,
      hint: question.hint || "",
      explanation: question.explanation || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateQuestion = (data: z.infer<typeof questionSchema>) => {
    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion.id, data });
    }
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      deleteQuestionMutation.mutate(id);
    }
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
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-800">لوحة التحكم الإدارية</h1>
                <p className="text-sm text-neutral-600">إدارة الأسئلة والمحتوى</p>
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-4">
              <Button
                onClick={() => seedFirebaseMutation.mutate()}
                disabled={seedFirebaseMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {seedFirebaseMutation.isPending ? "جاري الرفع..." : "رفع البيانات إلى Firebase"}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة سؤال جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingQuestion ? "تعديل السؤال" : "إضافة سؤال جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(editingQuestion ? handleUpdateQuestion : handleAddQuestion)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>السؤال</FormLabel>
                            <FormControl>
                              <Textarea placeholder="أدخل نص السؤال..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الإجابة</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الإجابة الصحيحة..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الفئة</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر الفئة" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="difficulty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>المستوى</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر المستوى" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {difficulties.map((difficulty) => (
                                    <SelectItem key={difficulty} value={difficulty}>
                                      {difficulty}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="hint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>التلميح (اختياري)</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل تلميح للسؤال..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="explanation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>شرح الإجابة (اختياري)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="أدخل شرح للإجابة..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex space-x-reverse space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddDialogOpen(false);
                            setEditingQuestion(null);
                            form.reset();
                          }}
                        >
                          إلغاء
                        </Button>
                        <Button
                          type="submit"
                          disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                        >
                          {editingQuestion ? "تحديث" : "إضافة"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="ml-2 h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <HelpCircle className="text-primary h-6 w-6" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-neutral-600">إجمالي الأسئلة</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats?.totalQuestions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="text-secondary h-6 w-6" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-neutral-600">المستخدمين</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="text-yellow-500 h-6 w-6" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-neutral-600">الألعاب المكتملة</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats?.totalGamesPlayed || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-red-500 h-6 w-6" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-neutral-600">الإيرادات الشهرية</p>
                  <p className="text-2xl font-bold text-neutral-900">${stats?.monthlyRevenue || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>إدارة الأسئلة</CardTitle>
              <div className="flex items-center space-x-reverse space-x-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="جميع الفئات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الفئات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="جميع المستويات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع المستويات</SelectItem>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">السؤال</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">المستوى</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionsData?.questions?.map((question: any) => (
                  <TableRow key={question.id}>
                    <TableCell className="max-w-md">
                      <div className="text-sm font-medium text-neutral-900 truncate">
                        {question.question}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(question.category)}>
                        {question.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-reverse space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
