import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CartPage from "./components/cart/CartPage";
import AuthProvider from "./components/context/AuthContext";
import { CartProvider } from "./components/context/CardContext";
import Login from "./components/login/Login";
import ProductList from "./components/product/ProductList";
import ProtectedLayout from "./components/protectedLayout/ProtectedLayout";
import PrivateRoute from "./components/routes/PrivateRoute";
import Signup from "./components/signup/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Signup />}></Route>
            <Route
              path="/product"
              element={
                <PrivateRoute>
                  <ProtectedLayout>
                    <ProductList />
                  </ProtectedLayout>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <ProtectedLayout>
                    <CartPage />
                  </ProtectedLayout>
                </PrivateRoute>
              }
            ></Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
