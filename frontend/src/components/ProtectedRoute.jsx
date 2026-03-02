import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/check-auth");
        const userRole = res.data.role;

        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch {
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthorized === null) return <p>Loading...</p>;

  return isAuthorized ? children : <Navigate to="/" />;
}

export default ProtectedRoute;