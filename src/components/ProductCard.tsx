import { Product } from "../types";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star } from "lucide-react";

const DEFAULT_PRODUCT_IMAGE = "https://placehold.co/400x400?text=Product";
const DEFAULT_VIBE = "Featured";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const imageSrc = product.image || DEFAULT_PRODUCT_IMAGE;
  const vibeLabel = product.vibe || DEFAULT_VIBE;
  const hasRatings = typeof product.rating === "number" && typeof product.reviews === "number";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <ImageWithFallback
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2">{vibeLabel}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full">
          <h3 className="line-clamp-1">{product.name}</h3>
          {hasRatings && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-600">{product.rating}</span>
            </div>
          )}
          <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(product)}
          >
            View Details
          </Button>
          <Button
            className="flex-1"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
