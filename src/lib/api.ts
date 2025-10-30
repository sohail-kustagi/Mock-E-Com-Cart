const DEFAULT_API_BASE_URL = "http://localhost:5000";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", body, token, headers = {} } = options;

  const requestHeaders: Record<string, string> = { ...headers };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
    requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let message = "Request failed";

    if (contentType.includes("application/json")) {
      try {
        const data = await response.json();
        message = data.message || message;
      } catch (error) {
        // Ignore JSON parsing errors and use default message
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return undefined as T;
};

export interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  vibe?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiCartItem {
  _id: string;
  user: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CheckoutResponse {
  total: number;
  timestamp: string;
  items: CheckoutItem[];
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  getProducts: () => request<ApiProduct[]>("/api/products"),
  getCart: (token: string) =>
    request<ApiCartItem[]>("/api/cart", {
      method: "GET",
      token,
    }),
  addOrUpdateCartItem: (token: string, productId: string, quantity: number) =>
    request<ApiCartItem>("/api/cart", {
      method: "POST",
      body: { productId, quantity },
      token,
    }),
  removeCartItem: (token: string, productId: string) =>
    request<{ message: string }>(`/api/cart/${productId}`, {
      method: "DELETE",
      token,
    }),
  checkout: (token: string) =>
    request<CheckoutResponse>("/api/cart/checkout", {
      method: "POST",
      token,
    }),
};

export default api;
