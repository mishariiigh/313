import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { user, login, register, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (user) {
    return null;
  }

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values.email, values.password);
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      await register(values.email, values.password, values.name);
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 luxury-button rounded-full flex items-center justify-center mb-6 floating glow">
            <Brain className="text-white h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-4">منصة الألعاب الثقافية</h1>
          <p className="text-muted-foreground text-lg">اختبر معلوماتك مع الأصدقاء والعائلة</p>
        </div>

        {/* Auth Form */}
        <div className="luxury-card p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="h-10 items-center justify-center rounded-md bg-muted text-muted-foreground grid w-full grid-cols-2 luxury-card p-1 mt-[0px] mb-[0px] pt-[0px] pb-[0px]">
              <TabsTrigger value="login" className="luxury-button-secondary">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register" className="luxury-button-secondary">إنشاء حساب</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-luxury-green-dark font-semibold">البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل بريدك الإلكتروني" {...field} className="luxury-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-luxury-green-dark font-semibold">كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="أدخل كلمة المرور" {...field} className="luxury-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button type="submit" className="luxury-button w-full text-lg py-4" disabled={isLoading}>
                    {isLoading ? (
                      <div className="luxury-spinner mx-auto" />
                    ) : (
                      "تسجيل الدخول"
                    )}
                  </button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-luxury-green-dark font-semibold">الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسمك الكامل" {...field} className="luxury-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-luxury-green-dark font-semibold">البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل بريدك الإلكتروني" {...field} className="luxury-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-luxury-green-dark font-semibold">كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="أدخل كلمة المرور" {...field} className="luxury-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-luxury-green-dark font-semibold">تأكيد كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="أعد إدخال كلمة المرور" {...field} className="luxury-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button type="submit" className="luxury-button w-full text-lg py-4" disabled={isLoading}>
                    {isLoading ? (
                      <div className="luxury-spinner mx-auto" />
                    ) : (
                      "إنشاء حساب جديد"
                    )}
                  </button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
