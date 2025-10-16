import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, Minus, ExternalLink } from "lucide-react";
import { cartService } from "../services";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data.data.cart);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    try {
      await cartService.updateItem(itemId, newQuantity);
      await fetchCart();
      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    try {
      await cartService.removeItem(itemId);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    setLoading(true);
    try {
      await cartService.clearCart();
      await fetchCart();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading cart..." />
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  // Calculate total price
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      // Parse price string (e.g., "EGP 1,234.56" or "1234.56" or "Null")
      const priceStr = item.price?.toString() || "0";

      if (priceStr === "Null" || !priceStr) {
        return total;
      }

      // Remove currency symbols, spaces, and commas
      const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, ""));

      if (!isNaN(priceNum)) {
        return total + priceNum * item.quantity;
      }
      return total;
    }, 0);
  };

  const totalPrice = calculateTotal();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="text-primary-600" size={36} />
            Shopping Cart
          </h1>
          {!isEmpty && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
            >
              Clear Cart
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="card p-12 text-center">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to add items to your cart
            </p>
            <a href="/" className="btn-primary inline-block">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="card p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={item.img || "https://via.placeholder.com/150"}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="mb-3">
                        <p className="text-xl font-bold text-primary-600">
                          {item.price}
                        </p>
                        {item.quantity > 1 &&
                          (() => {
                            const priceStr = item.price?.toString() || "0";
                            if (priceStr !== "Null" && priceStr) {
                              const priceNum = parseFloat(
                                priceStr.replace(/[^0-9.]/g, "")
                              );
                              if (!isNaN(priceNum)) {
                                const subtotal = priceNum * item.quantity;
                                return (
                                  <p className="text-sm text-gray-600">
                                    Subtotal: EGP{" "}
                                    {subtotal.toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </p>
                                );
                              }
                            }
                            return null;
                          })()}
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                            disabled={
                              item.quantity <= 1 || updatingItems[item._id]
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            disabled={updatingItems[item._id]}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Actions */}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                          title="View on store"
                        >
                          <ExternalLink size={20} />
                        </a>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={updatingItems[item._id]}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove from cart"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Items</span>
                    <span className="font-semibold">{totalItems}</span>
                  </div>

                  {totalPrice > 0 && (
                    <>
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Estimated Total
                        </span>
                        <span className="text-2xl font-bold text-primary-600">
                          EGP{" "}
                          {totalPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500 mb-4">
                      {totalPrice > 0
                        ? "Prices are estimates and may vary. Click on individual items to view them on their respective stores and complete your purchase."
                        : "Click on individual items to view them on their respective stores and complete your purchase."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
