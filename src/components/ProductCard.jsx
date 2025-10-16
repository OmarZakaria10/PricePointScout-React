import { ExternalLink, ShoppingCart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cartService } from "../services";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  // Extract price number from string or number (e.g., "799.99 EGP" -> 799.99 or 799.99 -> 799.99)
  const extractPrice = (priceValue) => {
    // If it's already a number, return it
    if (typeof priceValue === "number") {
      return priceValue;
    }

    // If it's a string, parse it
    if (typeof priceValue === "string") {
      const match = priceValue.match(/[\d,]+\.?\d*/);
      return match ? parseFloat(match[0].replace(",", "")) : 0;
    }

    // Default to 0 for null/undefined
    return 0;
  };

  const price = extractPrice(product.price);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    setIsAdding(true);
    try {
      await cartService.addItem({
        title: product.title,
        price:
          typeof product.price === "number"
            ? `${product.price} EGP`
            : product.price,
        link: product.link,
        img: product.img,
        quantity: 1,
      });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card overflow-hidden group">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={
            product.img || "https://via.placeholder.com/400x400?text=No+Image"
          }
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
        {product.source && (
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
            {product.source}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-primary-600">
            {typeof product.price === "number"
              ? `${price.toLocaleString()} EGP`
              : product.price}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5"
          >
            <ShoppingCart size={18} />
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
            title="View on store"
          >
            <ExternalLink size={20} className="text-gray-700" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
