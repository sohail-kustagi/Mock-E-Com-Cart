import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Product } from "../types";
import { Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const DEFAULT_PRODUCT_IMAGE = "https://placehold.co/600x600?text=Product";
const DEFAULT_VIBE = "Featured";
const DEFAULT_CATEGORY = "Lifestyle";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const imageSrc = product.image || DEFAULT_PRODUCT_IMAGE;
  const vibeLabel = product.vibe || DEFAULT_VIBE;
  const categoryLabel = product.category || DEFAULT_CATEGORY;
  const hasRatings =
    typeof product.rating === "number" && typeof product.reviews === "number";
  const descriptionText =
    product.description ||
    "This product is part of our Mock Cart collection. Updated details will appear here once available.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Badge className="mb-2">{vibeLabel}</Badge>
              <DialogTitle className="text-left">{product.name}</DialogTitle>
              <DialogDescription className="text-left mt-2">
                {categoryLabel}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="aspect-square rounded-lg overflow-hidden">
            <ImageWithFallback
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              {hasRatings && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}
              <p className="text-gray-700">{descriptionText}</p>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="mb-2">Select Size</h4>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <Button key={size} variant="outline" size="sm">
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <h4 className="mb-2">Available Colors</h4>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="secondary">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-gray-600">Price:</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                Add to Cart
              </Button>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-900">
                ✨ <strong>Vibe Check:</strong> {vibeLabel} - Perfect for your style mood!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
