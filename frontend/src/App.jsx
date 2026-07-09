// App.jsx
// Define las rutas principales del frontend de North Barber.

import { useContext } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";

import { Appointment } from "./pages/Appointment/Appointment";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Home } from "./pages/Home/Home";
import { ForgotPassword } from "./pages/Login/ForgotPassword";
import { Login } from "./pages/Login/Login";
import { ResetPassword } from "./pages/Login/ResetPassword";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;