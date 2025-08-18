import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "./firebase"; // initialized Firebase app

class ApiClient {
  static async throwIfResNotOk(res: Response) {
    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      if (text.includes("Firebase") || text.includes("auth/")) {
        throw new Error("خطأ في الاتصال بـ Firebase. تحقق من إعدادات المشروع.");
      }
      throw new Error(`${res.status}: ${text}`);
    }
  }

  static async getAuthHeaders(extra: Record<string, string> = {}) {
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

  static async request(method: string, url: string, body?: any) {
    const headers = await ApiClient.getAuthHeaders();
    const res = await fetch(url, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
    await ApiClient.throwIfResNotOk(res);
    return res.json();
  }

  static getQueryFn: <T>(options: { on401: "returnNull" | "throw" }) => QueryFunction<T> =
    ({ on401 }) =>
    async ({ queryKey }) => {
      const headers = await ApiClient.getAuthHeaders();
      const res = await fetch(queryKey.join("/") as string, {
        headers,
        credentials: "include",
      });

      if (on401 === "returnNull" && res.status === 401) return null;

      await ApiClient.throwIfResNotOk(res);
      return res.json();
    };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ApiClient.getQueryFn({ on401: "throw" }),
      refetchOnWindowFocus: false,
      refetchInterval: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export default ApiClient;
