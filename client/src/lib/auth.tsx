import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./queryClient";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

interface User {
  id: number;
  email: string;
  name: string;
  availableGames: number;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true); // Initialize loading state
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: authData, error: authError } = useQuery<{ user: User | null }>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/auth/me");
      if (!response.ok) {
        // Handle cases where the backend might return an error status
        // For example, if the user is not logged in on the backend
        if (response.status === 401 || response.status === 403) {
          return { user: null }; // Treat as not logged in
        }
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }
      return response.json();
    },
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      setLoading(true);
      try {
        if (firebaseUser) {
          // Get the ID token
          const idToken = await firebaseUser.getIdToken();
          console.log('Got ID token for:', firebaseUser.email);

          // Send to backend for session creation
          const response = await apiRequest('POST', '/api/auth/google', { idToken });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            console.log('User authenticated:', data.user.email);
          } else {
            const errorData = await response.json();
            console.error('Backend authentication failed:', errorData.message);
            setUser(null);
            // Sign out from Firebase if backend auth fails
            try {
              await signOut(auth);
            } catch (signOutError) {
              console.error('Error signing out after backend auth failure:', signOutError);
            }
          }
        } else {
          console.log('No Firebase user, clearing local user state');
          setUser(null);
        }
      } catch (error: any) {
        console.error('Auth state change error:', error);

        // Handle specific Firebase errors
        if (error?.code === 'auth/invalid-api-key') {
          console.error('Firebase API key is invalid. Please check your environment variables.');
          toast({
            title: "Firebase Error",
            description: "Invalid API key. Please contact support.",
            variant: "destructive",
          });
        } else if (error?.code === 'auth/network-request-failed') {
          console.error('Network error. Please check your internet connection.');
          toast({
            title: "Network Error",
            description: "Please check your internet connection.",
            variant: "destructive",
          });
        } else if (error?.code === 'auth/too-many-requests') {
          console.error('Too many requests. Please try again later.');
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please try again later.",
            variant: "destructive",
          });
        } else {
          // Generic error handling for other authentication issues
          toast({
            title: "Authentication Error",
            description: error.message || "An unexpected error occurred during authentication.",
            variant: "destructive",
          });
        }

        setUser(null);
        // Try to sign out from Firebase on error
        try {
          await signOut(auth);
        } catch (signOutError) {
          console.error('Error signing out on general error:', signOutError);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Update user state when authData from useQuery changes
  useEffect(() => {
    if (authData?.user !== undefined) { // Check for undefined to distinguish initial load from no user
      setUser(authData.user);
    }
  }, [authData]);


  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/dashboard");
      toast({
        title: "مرحباً بك",
        description: "تم تسجيل الدخول بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "تحقق من بياناتك وحاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", { email, password, name });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/dashboard");
      toast({
        title: "مرحباً بك",
        description: "تم إنشاء حسابك بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }
    },
    onSuccess: () => {
      setUser(null);
      queryClient.clear(); // Clear all query data, including auth state
      setLocation("/auth");
      toast({
        title: "تم تسجيل الخروج",
        description: "إلى اللقاء!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message || "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, name: string) => {
    await registerMutation.mutateAsync({ email, password, name });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // The isLoading state should now reflect the initial Firebase auth check and the ongoing mutations
  const combinedIsLoading = isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading: combinedIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect only if not loading and no user is found
    if (!isLoading && user === null) {
      setLocation("/auth");
    }
    // If user exists and we are not loading, do nothing (stay on current page)
  }, [user, isLoading, setLocation]);

  return { user, isLoading };
}