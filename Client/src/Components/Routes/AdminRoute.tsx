import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isUserLoggedIn, userRole } = useAuth();

  if (!isUserLoggedIn) {
    return <Navigate to="/api/user/login" replace />;
  }

  if (userRole !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;