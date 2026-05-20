import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { getSecureApiData } from "../Services/api";
import Loader from "./Layouts/Loader";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
        return;
      }

      try {
        const res = await getSecureApiData(
          `pharmacy/${localStorage.getItem("userId")}`
        );

        if (res?.success) {
          setIsAuthenticated(true);

          if (res?.nextStep) {
            navigate(res.nextStep);
          }
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        const toastId = "token-Id";

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        setIsAuthenticated(false);

        if (!toast.isActive(toastId)) {
          toast.error("Token expired. Please log in again.", {
            toastId: toastId,
          });
        }

        navigate("/login", { replace: true });
      }
    };

    validateToken();
  }, [navigate]);

  // ⛔ ye second useEffect ab zaroori nahi hai → remove kar diya

  if (isAuthenticated === null) {
    return <Loader/>;
  }

  // ✅ IMPORTANT CHANGE
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;