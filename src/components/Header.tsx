import { ShoppingCart, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  isLoggedIn: boolean;
  cartItemCount: number;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onCartClick: () => void;
  onLogoutClick: () => void;
}

export function Header({
  isLoggedIn,
  cartItemCount,
  onLoginClick,
  onSignUpClick,
  onCartClick,
  onLogoutClick,
}: HeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-purple-600" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">VibeVault</span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                    {cartItemCount}
                  </Badge>
                )}
              </button>
              <Button variant="outline" onClick={onLogoutClick} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onLoginClick}>
                Login
              </Button>
              <Button onClick={onSignUpClick}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
