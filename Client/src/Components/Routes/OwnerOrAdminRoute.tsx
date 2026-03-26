import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../Contexts/AuthContext";

interface OwnerOrAdminRouteProps {
  children: React.ReactNode;
}

const OwnerOrAdminRoute: React.FC<OwnerOrAdminRouteProps> = ({ children }) => {
  const { isUserLoggedIn, userRole } = useAuth();
  const { id } = useParams<{ id: string }>();
  const currentUserId = Cookies.get("UserId");

  if (!isUserLoggedIn) {
    return <Navigate to="/api/user/login" replace />;
  }

  if (userRole === "Admin") {
    return <>{children}</>;
  }

  if (currentUserId && id && currentUserId === id) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
};

export default OwnerOrAdminRoute;