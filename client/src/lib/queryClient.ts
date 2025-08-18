import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { auth } from "./firebase"; // your initialized firebase app

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    if (text.includes("Firebase") || text.includes("auth/")) {
      throw new Error("خطأ في الاتصال بـ Firebase. تحقق من إعدادات المشروع.");
    }
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper: build headers with token
async function withAuthHeaders(extra: Record<string, string> = {}) {
  let token: string | null = null;

  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (err) {
      console.warn("Failed to get Firebase token:", err);
    }
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

// General API request
export const apiRequest = async (
  method: string,
  url: string,
  body?: any
): Promise<Response> => {
  const headers = await withAuthHeaders();

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, config);
  await throwIfResNotOk(response);
  return response;
};

type UnauthorizedBehavior = "returnNull" | "throw";

// Query function for React Query
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401 }) =>
  async ({ queryKey }) => {
    const headers = await withAuthHeaders();
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers,
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return res.json();
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