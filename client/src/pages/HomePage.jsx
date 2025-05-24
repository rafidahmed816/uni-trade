import React from 'react';

const HomePage = ({ user, onLogout }) => {
  const containerStyle = {
    minHeight: 'calc(100vh - 80px)',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '0'
  };

  const heroSectionStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    minHeight: '600px'
  };

  const textSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const mainHeadingStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    lineHeight: '1.1',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px'
  };

  const subHeadingStyle = {
    fontSize: '1.3rem',
    color: '#4a5568',
    lineHeight: '1.6',
    fontWeight: '400'
  };

  const welcomeTextStyle = {
    fontSize: '1.1rem',
    color: '#2d3748',
    background: 'rgba(255,255,255,0.8)',
    padding: '16px 24px',
    borderRadius: '12px',
    borderLeft: '4px solid #667eea',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  const imagePlaceholderStyle = {
    width: '100%',
    height: '500px',
    background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #667eea',
    color: '#667eea',
    fontSize: '1.2rem',
    fontWeight: '600',
    textAlign: 'center',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(102,126,234,0.1)'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '32px'
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
  };

  const secondaryButtonStyle = {
    background: 'rgba(255,255,255,0.9)',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '12px 26px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const handleButtonHover = (e, isPrimary) => {
    if (isPrimary) {
      e.target.style.transform = 'translateY(-3px)';
      e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.4)';
    } else {
      e.target.style.background = '#667eea';
      e.target.style.color = 'white';
      e.target.style.transform = 'translateY(-2px)';
    }
  };

  const handleButtonLeave = (e, isPrimary) => {
    if (isPrimary) {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
    } else {
      e.target.style.background = 'rgba(255,255,255,0.9)';
      e.target.style.color = '#667eea';
      e.target.style.transform = 'translateY(0)';
    }
  };

  return (
    <div style={containerStyle}>
      <div style={heroSectionStyle}>
        <div style={textSectionStyle}>
          <div>
            <h1 style={mainHeadingStyle}>
              Welcome to UniTrade
            </h1>
            <p style={subHeadingStyle}>
              The ultimate marketplace for university students to buy, sell, and trade everything they need for campus life.
            </p>
          </div>
          
          {user && user.name && (
            <div style={welcomeTextStyle}>
              <strong>Hello, {user.name}!</strong> Ready to explore what your campus community has to offer?
            </div>
          )}
          
          <div style={buttonGroupStyle}>
            <button
              style={primaryButtonStyle}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonLeave(e, true)}
              onClick={() => console.log('Navigate to marketplace')}
            >
              Explore Marketplace
            </button>
            <button
              style={secondaryButtonStyle}
              onMouseEnter={(e) => handleButtonHover(e, false)}
              onMouseLeave={(e) => handleButtonLeave(e, false)}
              onClick={() => console.log('Start selling')}
            >
              Start Selling
            </button>
          </div>
        </div>
        
        <div style={imagePlaceholderStyle}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎓</div>
            <div>Your image will go here</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '8px' }}>
              (Replace this placeholder with your hero image)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;