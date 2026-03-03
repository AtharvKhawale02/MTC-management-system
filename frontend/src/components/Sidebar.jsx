import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import Icon from "./Icon";
import "./Sidebar.css";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMasterOpen, setIsMasterOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get role from localStorage
  const userRole = localStorage.getItem("role") || "";
  const isAdmin = userRole.toLowerCase() === "admin";

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMasterMenu = () => {
    setIsMasterOpen(!isMasterOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Toggle Button */}
      <div className="sidebar-header">
        {!isCollapsed && <h2 className="sidebar-title">MTC System</h2>}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <Icon name="menu" size={20} /> : <Icon name="close" size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <span className="nav-icon"><Icon name="dashboard" size={20} /></span>
          {!isCollapsed && <span className="nav-text">Dashboard</span>}
        </Link>

        {/* Manage TCDS */}
        <Link
          to="/manage-tcds"
          className={`nav-item ${isActive("/manage-tcds") ? "active" : ""}`}
          title={isCollapsed ? "Manage TCDS" : ""}
        >
          <span className="nav-icon"><Icon name="document" size={20} /></span>
          {!isCollapsed && <span className="nav-text">Manage TCDS</span>}
        </Link>

        {/* Manage MTC */}
        <Link
          to="/manage-mtc"
          className={`nav-item ${isActive("/manage-mtc") ? "active" : ""}`}
          title={isCollapsed ? "Manage MTC" : ""}
        >
          <span className="nav-icon"><Icon name="tool" size={20} /></span>
          {!isCollapsed && <span className="nav-text">Manage MTC</span>}
        </Link>

        {/* View TCDS */}
        <Link
          to="/view-tcds"
          className={`nav-item ${isActive("/view-tcds") ? "active" : ""}`}
          title={isCollapsed ? "View TCDS" : ""}
        >
          <span className="nav-icon"><Icon name="eye" size={20} /></span>
          {!isCollapsed && <span className="nav-text">View TCDS</span>}
        </Link>

        {/* View Certificate */}
        <Link
          to="/view-certificate"
          className={`nav-item ${isActive("/view-certificate") ? "active" : ""}`}
          title={isCollapsed ? "View Certificate" : ""}
        >
          <span className="nav-icon"><Icon name="certificate" size={20} /></span>
          {!isCollapsed && <span className="nav-text">View Certificate</span>}
        </Link>

        {/* Master Management - Admin Only */}
        {isAdmin && (
          <>
            <div className="nav-divider"></div>
            
            <div className="nav-dropdown">
              <button
                className={`nav-item dropdown-toggle ${
                  location.pathname.startsWith("/admin/") ? "active" : ""
                }`}
                onClick={toggleMasterMenu}
                title={isCollapsed ? "Master Management" : ""}
              >
                <span className="nav-icon"><Icon name="settings" size={20} /></span>
                {!isCollapsed && (
                  <>
                    <span className="nav-text">Master Management</span>
                    <span className={`dropdown-arrow ${isMasterOpen ? "open" : ""}`}>
                      ▼
                    </span>
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {isMasterOpen && !isCollapsed && (
                <div className="dropdown-menu">
                  <Link
                    to="/admin/users"
                    className={`dropdown-item ${
                      isActive("/admin/users") ? "active" : ""
                    }`}
                  >
                    <span className="dropdown-icon"><Icon name="users" size={16} /></span>
                    <span className="dropdown-text">User Management</span>
                  </Link>

                  <Link
                    to="/admin/valve-config"
                    className={`dropdown-item ${
                      isActive("/admin/valve-config") ? "active" : ""
                    }`}
                  >
                    <span className="dropdown-icon"><Icon name="bolt" size={16} /></span>
                    <span className="dropdown-text">Valve Configuration</span>
                  </Link>

                  <Link
                    to="/admin/accessories-config"
                    className={`dropdown-item ${
                      isActive("/admin/accessories-config") ? "active" : ""
                    }`}
                  >
                    <span className="dropdown-icon"><Icon name="toolbox" size={16} /></span>
                    <span className="dropdown-text">Accessories Configuration</span>
                  </Link>

                  <Link
                    to="/admin/api-config"
                    className={`dropdown-item ${
                      isActive("/admin/api-config") ? "active" : ""
                    }`}
                  >
                    <span className="dropdown-icon"><Icon name="clipboard" size={16} /></span>
                    <span className="dropdown-text">API 6D/600 Configuration</span>
                  </Link>

                  <Link
                    to="/admin/accessory-component"
                    className={`dropdown-item ${
                      isActive("/admin/accessory-component") ? "active" : ""
                    }`}
                  >
                    <span className="dropdown-icon"><Icon name="plug" size={16} /></span>
                    <span className="dropdown-text">Accessory Component</span>
                  </Link>

                  <Link
                    to="/admin/testing-details"
                    className={`dropdown-item ${
                      isActive("/admin/testing-details") ? "active" : ""
                    }`}
                  >
                    <span className="dropdown-icon"><Icon name="test" size={16} /></span>
                    <span className="dropdown-text">Testing Details</span>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Logout Button at Bottom */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} title={isCollapsed ? "Logout" : ""}>
          <span className="logout-icon"><Icon name="logout" size={20} /></span>
          {!isCollapsed && <span className="logout-text">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
