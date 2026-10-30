import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

interface OwnerOrAdminRouteProps {
  children: React.ReactNode;
}

const OwnerOrAdminRoute: React.FC<OwnerOrAdminRouteProps> = ({ children }) => {
  const { isUserLoggedIn, isAuthLoading, userRole, userId } = useAuth();
  const { id } = useParams<{ id: string }>();

  if (isAuthLoading) {
    return null;
  }

  if (!isUserLoggedIn) {
    return <Navigate to="/api/user/login" replace />;
  }

  if (userRole === "Admin") {
    return <>{children}</>;
  }

  if (userId && id && userId === id) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
};

export default OwnerOrAdminRoute;
