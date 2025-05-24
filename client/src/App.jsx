import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Marketplace from "./pages/Marketplace";
import RegisterPage from "./pages/RegisterPage";
import "./styles/main.css";

const AppRoutes = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    setUser(data.user || { name: "User" });
    navigate("/home");
  };

  const handleRegisterSuccess = () => {
    setTimeout(() => navigate("/login"), 2000);
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <LoginPage
                onRegisterClick={() => navigate("/register")}
                onLoginSuccess={handleLoginSuccess}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <RegisterPage
                onLoginClick={() => navigate("/login")}
                onRegisterSuccess={handleRegisterSuccess}
              />
            )
          }
        />
        <Route
          path="/home"
          element={
            user ? (
              <HomePage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/marketplace"
          element={
            user ? <Marketplace user={user} /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
};

export default App;
