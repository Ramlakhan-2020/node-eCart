import React, { useEffect,createContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({children}) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();

  // Define public routes
  const publicRoutes = ["/","/login", "/register"];
  const isPublicRoute = publicRoutes.includes(location.pathname);


  const authCheck = async () => {
    try {
      const response = await fetch("http://localhost:3003/api/auth/status", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const refreshToken = await fetch(
          "http://localhost:3003/api/auth/refresh-token",
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (refreshToken.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    if(!isPublicRoute)
      authCheck();
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{isAuthenticated}}>
        {children}
    </AuthContext.Provider>
  );
}
