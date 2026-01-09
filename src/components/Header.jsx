function Header() {
  const handleStartOver = () => {
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <span className="logo-icon">💬</span>
          <span className="logo-text">Support</span>
        </div>

        <button className="start-over-btn" onClick={handleStartOver}>
          Start Over
        </button>
      </div>
    </header>
  );
}

export default Header;
