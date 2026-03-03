import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ManageTCDS from "./pages/ManageTCDS";
import ManageMTC from "./pages/ManageMTC";
import ViewTCDS from "./pages/ViewTCDS";
import ViewCertificate from "./pages/ViewCertificate";
import UserManagement from "./pages/admin/UserManagement";
import ValveConfiguration from "./pages/admin/ValveConfiguration";
import AccessoriesConfiguration from "./pages/admin/AccessoriesConfiguration";
import APIConfiguration from "./pages/admin/APIConfiguration";
import AccessoryComponent from "./pages/admin/AccessoryComponent";
import TestingDetails from "./pages/admin/TestingDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes with Layout (Sidebar) */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "sales", "quality"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Main Pages - Accessible to all authenticated users */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-tcds" element={<ManageTCDS />} />
          <Route path="manage-mtc" element={<ManageMTC />} />
          <Route path="view-tcds" element={<ViewTCDS />} />
          <Route path="view-certificate" element={<ViewCertificate />} />

          {/* Admin Only Routes */}
          <Route
            path="admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/valve-config"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ValveConfiguration />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/accessories-config"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AccessoriesConfiguration />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/api-config"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <APIConfiguration />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/accessory-component"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AccessoryComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/testing-details"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TestingDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Legacy redirects for old routes */}
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/sales" element={<Navigate to="/dashboard" replace />} />
        <Route path="/quality" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;