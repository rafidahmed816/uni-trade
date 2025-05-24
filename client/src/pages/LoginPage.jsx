import React, { useState } from "react";
import { login } from "../api/auth";

const LoginPage = ({ onRegisterClick, onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(form);
      if (data.error) {
        setError(data.error);
      } else {
        // Always save the new token after login
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (onLoginSuccess) onLoginSuccess(data);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="University Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="auth-link">
        Don't have an account?{" "}
        <button
          type="button"
          className="link-btn"
          onClick={onRegisterClick}
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default LoginPage;