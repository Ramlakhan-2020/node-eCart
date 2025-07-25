import React, { useEffect } from "react";
import { userCart } from "../context/CardContext";

const CartPage = () => {
  const { cartItems, setCartItems } = userCart();

  const getCartData = async () => {
    try {
      const fetchCart = await fetch("https://node-ecart-2.onrender.com/api/cart/", {
        credentials: "include",
      });
      const cartDetail = await fetchCart.json();
      if (cartDetail) setCartItems(cartDetail?.items);
    } catch (error) {
      Error("cart get api is not working");
    }
  };

  useEffect(() => {
    getCartData();
  }, []);

  const handleQuantityChange = async (productId, delta) => {
    const updatedItems = cartItems?.find((item) => {
      return item.productId.toString() === productId;
    });
    const newQuantity = updatedItems.quantity + delta;
    if (newQuantity <= 0) {
      const res = await fetch("https://node-ecart-2.onrender.com/api/cart/itemDelete", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      // Do not update local state here; wait for socket event
    } else {
      try {
        await fetch("https://node-ecart-2.onrender.com/api/cart/updateQuantity", {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: productId, quantity: newQuantity }),
        });
        // Do not update local state here; wait for socket event
      } catch (error) {
        console.error("Failed to update quantity", error);
      }
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await fetch("https://node-ecart-2.onrender.com/api/cart/itemDelete", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      // Do not update local state here; wait for socket event
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cartItems?.reduce(
    (acc, item) => acc + item?.price * item?.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold mb-6">🛒 Shopping Cart</h1>
      {cartItems?.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Your cart is empty.</p>
          <a
            href="/product"
            className="text-blue-600 hover:underline font-medium inline-block mt-2"
          >
            → Browse Products
          </a>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">
                    Item Description
                  </th>
                  <th className="py-3 px-4 text-center font-semibold">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-center font-semibold">Price</th>
                  <th className="py-3 px-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="py-3 px-4">{item.productName}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, -1)
                          }
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, 1)
                          }
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {(item?.price * item?.quantity)?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-red-500 font-bold hover:text-red-700"
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right mt-6">
            <p className="text-lg font-semibold">
              Total: {totalPrice?.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
