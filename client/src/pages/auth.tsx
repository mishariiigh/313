import React, { useState, useEffect } from "react";
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
import { FaGoogle } from "react-icons/fa";
import { signInWithGoogle, handleGoogleRedirect } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phoneNumber: z.string()
    .min(8, "رقم الهاتف يجب أن يكون 8 أرقام على الأقل")
    .regex(/^[0-9+\-\s()]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { user, login, register, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

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
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle Google redirect result
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await handleGoogleRedirect();
        if (result) {
          // User signed in with Google, redirect to dashboard
          setLocation("/dashboard");
        }
      } catch (error) {
        console.error('Error handling Google redirect:', error);
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "حدث خطأ أثناء تسجيل الدخول بجوجل",
          variant: "destructive",
        });
      }
    };

    handleRedirect();
  }, [setLocation, toast]);

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

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const user = await signInWithGoogle();
      
      // Get the ID token from the user
      const idToken = await user.getIdToken();
      
      // Send the ID token to our backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Redirect to dashboard on successful authentication
        window.location.href = '/dashboard';
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول بجوجل",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
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
          <h1 className="text-4xl font-bold text-gradient mb-4">313</h1>
          <p className="text-muted-foreground text-lg">اختبر معلوماتك مع الأصدقاء والعائلة</p>
        </div>

        {/* Auth Form */}
        <div className="luxury-card p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-lg">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register" className="text-lg">إنشاء حساب</TabsTrigger>
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
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">أو</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="luxury-button-outline w-full text-lg py-4 flex items-center justify-center gap-3"
                  >
                    {googleLoading ? (
                      <div className="luxury-spinner mx-auto" />
                    ) : (
                      <>
                        <FaGoogle className="h-5 w-5 text-red-500" />
                        تسجيل الدخول بجوجل
                      </>
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
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-luxury-green-dark font-semibold">رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل رقم الهاتف (مثال: +965 1234567)" {...field} className="luxury-input" />
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
