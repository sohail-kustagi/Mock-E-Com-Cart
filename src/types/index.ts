export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  vibe?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
