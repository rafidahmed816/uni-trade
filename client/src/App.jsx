import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import "./styles/main.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (data) => {
    setUser(data.user || { name: "User" }); // fallback if no user object
    setCurrentPage("home");
  };

  const handleRegisterSuccess = (data) => {
    setTimeout(() => setCurrentPage("login"), 2000);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("login");
  };

  return (
    <div>
      {currentPage === "login" && (
        <LoginPage
          onRegisterClick={() => setCurrentPage("register")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {currentPage === "register" && (
        <RegisterPage
          onLoginClick={() => setCurrentPage("login")}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
      {currentPage === "home" && (
        <HomePage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;