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
  const [isLoading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: authData, error: authError } = useQuery<{ user: User | null }>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/me");
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            return { user: null };
          }
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.log("Auth check failed, user not logged in");
        return { user: null };
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: authInitialized && !user, // Only enable after Firebase auth is initialized and we don't have a user yet
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        console.log('Initializing Firebase Auth...');
        
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log('Auth state changed:', firebaseUser?.email || 'No user');

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

                // Invalidate queries to refresh with new auth state
                queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
              } else {
                const errorData = await response.json();
                console.error('Backend authentication failed:', errorData.message);
                setUser(null);
                // Sign out from Firebase if backend auth fails
                await signOut(auth);
              }
            } else {
              console.log('No Firebase user, clearing local user state');
              setUser(null);
            }
          } catch (error: any) {
            console.error('Auth state change error:', error);
            setUser(null);
            
            // Show error to user only for serious issues
            if (error?.code === 'auth/network-request-failed') {
              toast({
                title: "Network Error",
                description: "Please check your internet connection.",
                variant: "destructive",
              });
            }
          } finally {
            // Mark auth as initialized and loading as false after first auth state change
            if (!authInitialized) {
              setAuthInitialized(true);
            }
            setLoading(false);
          }
        });

        console.log('Firebase Auth listener set up successfully');
      } catch (error) {
        console.error('Failed to initialize Firebase auth:', error);
        setAuthInitialized(true);
        setLoading(false);
      }
    };

    // Initialize auth immediately
    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [toast, queryClient, authInitialized]);

  // Update user state when authData from useQuery changes (only for session-based auth)
  useEffect(() => {
    if (authData?.user !== undefined && authInitialized && !user) {
      setUser(authData.user);
    }
  }, [authData, authInitialized, user]);


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

  // The isLoading state should reflect auth initialization and ongoing mutations
  const combinedIsLoading = (!authInitialized || isLoading) || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

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
    console.error("useAuth called outside of AuthProvider. Make sure your component is wrapped with AuthProvider.");
    console.error("Component tree:", new Error().stack);
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