import React, { useState } from "react";
import { register } from "../api/auth";

const RegisterPage = ({ onLoginClick, onRegisterSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    department: "",
    program: "",
    year: "",
    dob: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await register(form);
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("Registration successful! You can now login.");
        if (onRegisterSuccess) onRegisterSuccess(data);
        setForm({
          name: "",
          email: "",
          password: "",
          university: "",
          department: "",
          program: "",
          year: "",
          dob: "",
          phone: "",
        });
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <input
          name="university"
          placeholder="University"
          value={form.university}
          onChange={handleChange}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <input
          name="program"
          placeholder="Program"
          value={form.program}
          onChange={handleChange}
        />
        <input
          name="year"
          placeholder="Year of Study"
          value={form.year}
          onChange={handleChange}
        />
        <input
          name="dob"
          type="date"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="auth-link">
        Already have an account?{" "}
        <button
          type="button"
          className="link-btn"
          onClick={onLoginClick}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;