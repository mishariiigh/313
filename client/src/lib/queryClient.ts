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

export const apiRequest = async (method: string, url: string, data?: any): Promise<Response> => {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    // Log errors for debugging
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Request failed: ${method} ${url}`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      // Re-create response for consumption by caller
      return new Response(errorText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }

    return response;
  } catch (error) {
    console.error(`Network error for ${method} ${url}:`, error);

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
    }

    throw error;
  }
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
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