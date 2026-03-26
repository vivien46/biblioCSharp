import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isUserLoggedIn } = useAuth();

  if (!isUserLoggedIn) {
    return <Navigate to="/api/user/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;