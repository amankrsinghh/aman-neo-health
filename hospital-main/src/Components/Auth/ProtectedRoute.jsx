import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSecureApiData } from "../../Service/api";
import Loader from "../Common/Loader";

function ProtectedRoute({ children }) {
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
        const res = await getSecureApiData("api/comman/profile");
        if (res?.success) {
          setIsAuthenticated(true);
          // if(res.nextStep){
          //   navigate(res.nextStep)
          // }
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        localStorage.clear();
        sessionStorage.clear()
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      }
    };

    validateToken();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <Loader/>;
  }

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
