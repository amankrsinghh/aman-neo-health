import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getSecureApiData } from "./Services/api";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null); // store user role
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await getSecureApiData(`user/${userId}`);
        if (res?.success && res.data.role=="doctor") {
          setIsAuthenticated(true);
          setRole(res.data.role); // assuming API returns { data: { role: "patient" } }
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        toast.error("Session expired. Please log in again.");
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  // ⏳ While checking auth
  if (isAuthenticated === null) {
    return null; // or a loader/spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentPath = location.pathname;


  return <Outlet />;
};

export default ProtectedRoute;
