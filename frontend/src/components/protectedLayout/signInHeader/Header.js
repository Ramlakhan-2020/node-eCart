import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userCart } from '../../context/CardContext';

export default function Header() {
  const {clearCartCount, cardCount} = userCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch("http://localhost:3003/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    if (response.ok) {
      clearCartCount();
      navigate('/login');
    } else {
      return "Not able to logout having issue in logout API";
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md fixed top-0 w-full z-50 overflow-hidden">
      <div className="max-w-[auto] mx-auto px-8 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold flex items-center space-x-2">
          <img
            src="https://www.rohida.in/wp-content/uploads/2021/03/20210327_114523.jpg"
            alt="logo"
            className="w-6 h-6"
          />
          <span className="cursor-pointer" onClick={()=> navigate('/product')}>BookShop</span>
        </div>

        {/* Right Nav */}
        <div className="flex items-center space-x-6">
          
          <button
            className="relative flex items-center space-x-2 hover:text-yellow-200 transition"
            onClick={() => navigate("/cart")}
          >
            <div className="relative">
              <img
                src="https://img.icons8.com/ios-filled/24/ffffff/shopping-cart.png"
                alt="Cart"
                className="w-5 h-5"
              />
              {cardCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {cardCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
