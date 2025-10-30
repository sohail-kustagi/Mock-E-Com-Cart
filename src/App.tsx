import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { PleaseLoginModal } from "./components/PleaseLoginModal";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { CartModal } from "./components/CartModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { ReceiptModal } from "./components/ReceiptModal";
import { Product, CartItem, User } from "./types";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import api, { ApiCartItem, ApiProduct } from "./lib/api";

type ViewType = "home" | "login" | "signup";

const DEFAULT_PRODUCT_IMAGE = "https://placehold.co/400x400?text=Product";

const STORAGE_KEYS = {
  token: "mock-cart:token",
  user: "mock-cart:user",
};

const toProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct._id,
  name: apiProduct.name,
  price: apiProduct.price,
  image: apiProduct.imageUrl || DEFAULT_PRODUCT_IMAGE,
  description: apiProduct.description,
  vibe: apiProduct.vibe,
  category: apiProduct.category,
  sizes: apiProduct.sizes,
  colors: apiProduct.colors,
  rating: apiProduct.rating,
  reviews: apiProduct.reviews,
});

const mapCartItems = (items: ApiCartItem[], products: Product[]): CartItem[] => {
  const productLookup = new Map<string, Product>(
    products.map((product) => [product.id, product] as const)
  );

  return items.map((item: ApiCartItem) => {
    const matchedProduct = productLookup.get(item.product);

    const baseProduct: Product = matchedProduct
      ? { ...matchedProduct, price: item.price }
      : {
          id: item.product,
          name: item.name,
          price: item.price,
          image: DEFAULT_PRODUCT_IMAGE,
        };

    return {
      id: item._id,
      quantity: item.quantity,
      product: {
        ...baseProduct,
        name: item.name || baseProduct.name,
        price: item.price,
      },
    };
  });
};

const readStoredToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(STORAGE_KEYS.token);
};

const readStoredUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch (error) {
    console.warn("Failed to parse stored user", error);
    return null;
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [hasLoadedProducts, setHasLoadedProducts] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [showPleaseLoginModal, setShowPleaseLoginModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    totalPaid: number;
    timestamp: string;
  } | null>(null);

  const isLoggedIn = Boolean(user && token);
  const cartItemCount = cartItems.reduce<number>(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const data = await api.getProducts();
        const transformed = data.map(toProduct);
        setProducts(transformed);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load products.";
        toast.error(message);
      } finally {
        setProductsLoading(false);
        setHasLoadedProducts(true);
      }
    };

    fetchProducts();
  }, []);

  const loadCart = useCallback(
    async (authToken: string) => {
      try {
        const cartData = await api.getCart(authToken);
        setCartItems(mapCartItems(cartData, products));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load cart.";
        toast.error(message);
      }
    },
    [products]
  );

  const refreshCart = useCallback(async () => {
    if (!token) {
      return;
    }
    await loadCart(token);
  }, [token, loadCart]);

  useEffect(() => {
    if (token && hasLoadedProducts) {
      refreshCart();
    }
  }, [token, hasLoadedProducts, refreshCart]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (token) {
      window.localStorage.setItem(STORAGE_KEYS.token, token);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.token);
    }
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (user) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  const handleAddToCart = useCallback(
    async (product: Product) => {
      if (!isLoggedIn || !token) {
        setShowPleaseLoginModal(true);
        return;
      }

      const existingItem = cartItems.find(
        (item: CartItem) => item.product.id === product.id
      );
      const nextQuantity = existingItem ? existingItem.quantity + 1 : 1;

      try {
        await api.addOrUpdateCartItem(token, product.id, nextQuantity);
        await refreshCart();
        toast.success("Added to cart!", { description: product.name });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update cart.";
        toast.error(message);
      }
    },
    [cartItems, isLoggedIn, refreshCart, token]
  );

  const handleUpdateQuantity = useCallback(
    async (productId: string, newQuantity: number) => {
      if (!token) {
        return;
      }

      const quantity = Math.max(1, newQuantity);

      try {
        await api.addOrUpdateCartItem(token, productId, quantity);
        await refreshCart();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update quantity.";
        toast.error(message);
      }
    },
    [refreshCart, token]
  );

  const handleRemoveItem = useCallback(
    async (productId: string) => {
      if (!token) {
        return;
      }

      try {
        await api.removeCartItem(token, productId);
        await refreshCart();
        toast.success("Item removed from cart");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to remove item.";
        toast.error(message);
      }
    },
    [refreshCart, token]
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        const { token: authToken, user: authUser } = await api.login(email, password);
        setToken(authToken);
        setUser(authUser);
        setCurrentView("home");
        setShowPleaseLoginModal(false);
        toast.success("Successfully logged in!");
        await loadCart(authToken);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed.";
        throw new Error(message);
      }
    },
    [loadCart]
  );

  const handleSignUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const { token: authToken, user: authUser } = await api.register(name, email, password);
        setToken(authToken);
        setUser(authUser);
        setCurrentView("home");
        setShowPleaseLoginModal(false);
        toast.success("Account created successfully!");
        await loadCart(authToken);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Sign up failed.";
        throw new Error(message);
      }
    },
    [loadCart]
  );

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.message("Your cart is empty");
      return;
    }

    setShowCartModal(false);
    setShowCheckoutModal(true);
  };

  const handleSubmitOrder = useCallback(
    async (name: string, email: string) => {
      if (!token) {
        const error = new Error("Please log in to checkout.");
        toast.error(error.message);
        throw error;
      }

      try {
        const receipt = await api.checkout(token);
        await loadCart(token);

        setOrderDetails({
          totalPaid: receipt.total,
          timestamp: new Date(receipt.timestamp).toLocaleString(),
        });

        setShowCheckoutModal(false);
        setShowReceiptModal(true);
        toast.success(`Order placed${name ? `, ${name}` : ""}!`, {
          description: email ? `A confirmation has been sent to ${email}.` : undefined,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Checkout failed.";
        toast.error(message);
        throw error instanceof Error ? error : new Error(message);
      }
    },
    [loadCart, token]
  );

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setCartItems([]);
    setCurrentView("home");
    setShowCartModal(false);
    setShowCheckoutModal(false);
    setShowReceiptModal(false);
    setShowPleaseLoginModal(false);
    setOrderDetails(null);
    toast.success("Successfully logged out!");
  };

  const cartTotal = useMemo(
    () =>
      cartItems.reduce<number>(
        (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  if (currentView === "login") {
    return (
      <>
        <Header
          isLoggedIn={isLoggedIn}
          cartItemCount={cartItemCount}
          onLoginClick={() => setCurrentView("login")}
          onSignUpClick={() => setCurrentView("signup")}
          onCartClick={() => setShowCartModal(true)}
          onLogoutClick={handleLogout}
        />
        <LoginPage
          onLogin={handleLogin}
          onSignUpClick={() => setCurrentView("signup")}
        />
        <Toaster />
      </>
    );
  }

  if (currentView === "signup") {
    return (
      <>
        <Header
          isLoggedIn={isLoggedIn}
          cartItemCount={cartItemCount}
          onLoginClick={() => setCurrentView("login")}
          onSignUpClick={() => setCurrentView("signup")}
          onCartClick={() => setShowCartModal(true)}
          onLogoutClick={handleLogout}
        />
        <SignUpPage
          onSignUp={handleSignUp}
          onLoginClick={() => setCurrentView("login")}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartItemCount}
        onLoginClick={() => setCurrentView("login")}
        onSignUpClick={() => setCurrentView("signup")}
        onCartClick={() => setShowCartModal(true)}
        onLogoutClick={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1>Discover Your Vibe ✨</h1>
          <p className="text-gray-600">
            Shop the latest trends curated by AI and your favorite influencers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsLoading ? (
            <div className="col-span-full text-center text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No products available. Please check back later.
            </div>
          ) : (
            products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </main>

      <PleaseLoginModal
        isOpen={showPleaseLoginModal}
        onClose={() => setShowPleaseLoginModal(false)}
        onLoginClick={() => {
          setShowPleaseLoginModal(false);
          setCurrentView("login");
        }}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={showProductDetails}
        onClose={() => setShowProductDetails(false)}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleSubmitOrder}
        user={user}
        totalPrice={cartTotal}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        totalPaid={orderDetails?.totalPaid || 0}
        orderTimestamp={orderDetails?.timestamp || ""}
      />

      <Toaster />
    </div>
  );
}
