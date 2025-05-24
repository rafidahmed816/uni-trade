import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
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
import ProductDetails from "./pages/ProductDetails";
import RegisterPage from "./pages/RegisterPage";
import "./styles/main.css";

const AppRoutes = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    setUser(data.user || { name: "User" });
    localStorage.setItem("token", data.token); // Save token on login
    navigate("/home");
  };

  const handleRegisterSuccess = () => {
    setTimeout(() => navigate("/login"), 2000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
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
        <Route
          path="/marketplace/:id"
          element={user ? <ProductDetails /> : <Navigate to="/login" />}
        />
        {/* Only redirect to login if not authenticated, otherwise show 404 */}
        <Route
          path="*"
          element={user ? <div>404 Not Found</div> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Add loading state
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check for expiration
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(decoded.user || { name: "User" });
        }
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false); // ✅ Done checking token
  }, []);

  return (
    <Router>
      {loading ? (
        <div className="loading-screen">Loading...</div> // Optional: show spinner
      ) : (
        <AppRoutes user={user} setUser={setUser} />
      )}
    </Router>
  );
};

export default App;
