import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    // Handle specific Firebase errors
    if (text.includes('Firebase') || text.includes('auth/')) {
      throw new Error('خطأ في الاتصال بـ Firebase. تحقق من إعدادات المشروع.');
    }

    throw new Error(`${res.status}: ${text}`);
  }
}

export const apiRequest = async (method: string, url: string, body?: any): Promise<Response> => {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies/session data
  };

  // Add Firebase auth token if available
  try {
    const { auth } = await import("./firebase");
    
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
      console.log('Added Firebase token to request headers');
    } else {
      console.log('No Firebase user available for token');
    }
  } catch (error) {
    console.warn("Failed to get Firebase token:", error);
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  await throwIfResNotOk(response);
  return response;
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Firebase auth token if available
    try {
      const { auth } = await import("./firebase");
      
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to get Firebase token for query:", error);
    }

    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include", // Ensure cookies are sent
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});