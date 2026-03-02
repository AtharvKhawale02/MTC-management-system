import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

function SalesDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (_) {}
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div>
      <h1>Sales Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default SalesDashboard;