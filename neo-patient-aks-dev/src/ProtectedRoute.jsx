import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSecureApiData } from "./Services/api";
import Loader from "./Loader/Loader";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null); // store user role
  const location = useLocation();
  const navigate=useNavigate()

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
        if (res?.success) {
          if (res.data.role !== 'patient') {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            localStorage.removeItem("doctorId");
            localStorage.removeItem("staffId");
            toast.error("Unauthorized access. Only patients can log in here.");
            setIsAuthenticated(false);
            return;
          }
          if(res.nextStep){
            navigate(res.nextStep)
          }
          setIsAuthenticated(true);
          setRole(res.data.role); // assuming API returns { data: { role: "patient" } }
          localStorage.setItem('role', res.data.role);
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
    return <Loader/>; // or a loader/spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚦 Role-based redirection
  const patientRoutes = [
    "/my-appointment",
    "/chat",
    "/prescription",
    "/profile",
    "/share-health-card",
    "/approve-health-card",
    "/health-card-details",
    "/near-by-doctor",
    "/congratulations"
  ];

  const currentPath = location.pathname;

  return <Outlet />;
};

export default ProtectedRoute;
