import { useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const navbarStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    padding: "0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const toolbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    minHeight: "64px",
  };

  const logoStyle = {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "white",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    letterSpacing: "0.5px",
  };

  const navButtonsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const buttonStyle = {
    color: "white",
    fontWeight: "600",
    padding: "10px 20px",
    borderRadius: "25px",
    border: "none",
    background: "rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    backdropFilter: "blur(10px)",
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    background: "rgba(244,67,54,0.6)",
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
    if (e.target.dataset.type === "logout") {
      e.target.style.background = "rgba(244,67,54,0.9)";
    } else {
      e.target.style.background = "rgba(255,255,255,0.2)";
    }
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "none";
    if (e.target.dataset.type === "logout") {
      e.target.style.background = "rgba(244,67,54,0.6)";
    } else {
      e.target.style.background = "rgba(255,255,255,0.1)";
    }
  };

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        <div style={toolbarStyle}>
          <div style={logoStyle}>UniTrade</div>

          <div style={navButtonsStyle}>
            <button
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate("/marketplace")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Marketplace
            </button>

            <button
              style={logoutButtonStyle}
              data-type="logout"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={onLogout}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
