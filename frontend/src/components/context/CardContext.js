import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const CartContext = createContext();

export const userCart= ()=> useContext(CartContext);

export const CartProvider =({children}) =>{
    const  [cardCount, setCardCount] = useState(0);
    const  [cartItems, setCartItems] = useState([]);
    const socketRef = useRef(null);

    // Connect and join user room for real-time updates
    const joinUserRoom = async () => {
      if (!socketRef.current) {
        socketRef.current = io("http://localhost:3003", {
          withCredentials: true,
        });
      }
      try {
        const res = await fetch("http://localhost:3003/api/auth/status", {
          credentials: "include",
        });
        const data = await res.json();
        const userId = data?.user?._id || data?.userId;
        if (userId) {
          socketRef.current.emit("join", userId);
        }
        // Remove previous listener to prevent duplicates
        socketRef.current.off("cartUpdated");
        socketRef.current.on("cartUpdated", (data) => {
          if (data?.cart?.items) {
            setCartItems(data.cart.items);
            setCardCount(data.cart.items.length);
          }
        });
        // Optional: Debug/error logging
        socketRef.current.on("connect_error", (err) => {
          console.error("Socket connect error:", err);
        });
        socketRef.current.on("disconnect", (reason) => {
          console.warn("Socket disconnected:", reason);
        });
      } catch (error) {
        console.error("Failed to fetch userId for socket join:", error);
      }
    };

    // Fetch cart data
    const getcartCount = async() =>{
        try {
           const cardData = await fetch("http://localhost:3003/api/cart/",{
            credentials: "include"
           });
           const data = await cardData.json();
           const count = data?.items?.length || 0;
           setCardCount(count);
           setCartItems(data?.items || []);
        } catch (error) {
          Error("get cart api is not working");
        }
      }
      const clearCartCount = () => {
        setCardCount(0);  // 🧼 Reset on logout
        setCartItems([]);
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    
    useEffect(() => {
      const checkAndJoin = async () => {
        try {
          const res = await fetch("http://localhost:3003/api/auth/status", {
            credentials: "include",
          });
          const data = await res.json();
          if (data?.isAuthenticated || data?.user?._id || data?.userId) {
            await joinUserRoom();
          }
        } catch (err) {
          // Not authenticated, do nothing
        }
      };
      getcartCount();
      checkAndJoin();
      return () => {
        if (socketRef.current) {
          socketRef.current.off("cartUpdated");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }, []);

return (
    <CartContext.Provider value= {{cardCount, setCardCount, clearCartCount, getcartCount, cartItems, setCartItems, joinUserRoom}}>
        {children}
    </CartContext.Provider>
)
}