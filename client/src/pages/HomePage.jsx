import React from "react";

const HomePage = ({ user, onLogout }) => {
  return (
    <div className="auth-container">
      <h2>Welcome{user && user.name ? `, ${user.name}` : ""}!</h2>
      <p>You are now logged in to Uni Trade.</p>
      <button onClick={onLogout} style={{ marginTop: "1.5rem" }}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;