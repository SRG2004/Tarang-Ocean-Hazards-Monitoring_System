import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/LoginPage";
// ...existing imports...
// import dashboards etc.

export default function AppRouter() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Role selection landing page */}
        <Route path="/" element={!user ? <RoleSelectionPage /> : <Navigate to="/dashboard" />} />
        {/* Login page with optional role param */}
        <Route path="/login/:role?" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        {/* Authenticated dashboard */}
        <Route path="/dashboard/*" element={user ? <MainLayout /> : <Navigate to="/" />} />
        {/* ...other routes... */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}
