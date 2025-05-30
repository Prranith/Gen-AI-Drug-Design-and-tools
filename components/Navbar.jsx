import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/Navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setActivePath(location.pathname);
    setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogoutClick = () => {
    setIsNavigating(true);
    setTimeout(() => {
      onLogout();
      navigate("/login");
      setIsNavigating(false);
    }, 300);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateTo = (path) => {
    setIsNavigating(true);
    setIsProfileDropdownOpen(false);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 300);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const AccordionItem = ({ title, children, isOpen, onToggle }) => (
    <div className="accordion-item">
      <button className="accordion-title" onClick={onToggle} aria-expanded={isOpen}>
        {title} <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );

  const [isDrugDesignOpen, setIsDrugDesignOpen] = useState(false);
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);

  const profileDetails = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Research Scientist",
  };

  return (
    <div className="nav-container">
      {isNavigating && (
        <div className="navigation-overlay">
          <div className="loader" />
        </div>
      )}
      <div className="profile-container" ref={dropdownRef}>
        <div
          className="profile-logo"
          onClick={toggleProfileDropdown}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && toggleProfileDropdown()}
          aria-label="Toggle profile details"
          aria-expanded={isProfileDropdownOpen}
        >
          👤
        </div>
        {isProfileDropdownOpen && (
          <div className="profile-dropdown">
            <h3>Profile Details</h3>
            <div className="profile-detail">
              <span className="detail-label">Name:</span>
              <span>{profileDetails.name}</span>
            </div>
            <div className="profile-detail">
              <span className="detail-label">Email:</span>
              <span>{profileDetails.email}</span>
            </div>
            <div className="profile-detail">
              <span className="detail-label">Role:</span>
              <span>{profileDetails.role}</span>
            </div>
            <button
              className="dropdown-button view-profile"
              onClick={() => navigateTo("/profile")}
              aria-label="View full profile"
            >
              View Full Profile
            </button>
            <button
              className="dropdown-button close-button"
              onClick={() => setIsProfileDropdownOpen(false)}
              aria-label="Close profile dropdown"
            >
              Close
            </button>
          </div>
        )}
      </div>
      <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle navigation menu">
        ☰
      </button>
      <div className="brand-title" onClick={() => navigateTo("/dashboard")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && navigateTo("/dashboard")}>
        🩺 Gen-AI Drug Design
      </div>
      <button
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {isAuthenticated && (
          <>
            <button
              className={`nav-item ${activePath === "/dashboard" ? "active" : ""}`}
              onClick={() => navigateTo("/dashboard")}
              aria-current={activePath === "/dashboard" ? "page" : undefined}
            >
              Home
            </button>
            <button
              className={`nav-item ${activePath === "/diagnosis" ? "active" : ""}`}
              onClick={() => navigateTo("/diagnosis")}
              aria-current={activePath === "/diagnosis" ? "page" : undefined}
            >
              Health Check
            </button>
            <AccordionItem
              title="Drug Creation"
              isOpen={isDrugDesignOpen}
              onToggle={() => setIsDrugDesignOpen(!isDrugDesignOpen)}
            >
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/reinforcement" ? "active" : ""}`}
                  onClick={() => navigateTo("/reinforcement")}
                  aria-current={activePath === "/reinforcement" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">🧪</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">PIC50 Optimization</span>
                    <span className="nav-subitem-description">Optimize drug potency using AI-driven PIC50 modeling.</span>
                  </div>
                </button>
              </div>
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/reinforcement2" ? "active" : ""}`}
                  onClick={() => navigateTo("/reinforcement2")}
                  aria-current={activePath === "/reinforcement2" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">🧬</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">LogP Optimization</span>
                    <span className="nav-subitem-description">Enhance drug solubility with LogP optimization tools.</span>
                  </div>
                </button>
              </div>
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/qsar-modeling" ? "active" : ""}`}
                  onClick={() => navigateTo("/qsar-modeling")}
                  aria-current={activePath === "/qsar-modeling" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">📈</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">QSAR Modeling</span>
                    <span className="nav-subitem-description">Predict drug activity using quantitative structure-activity relationships.</span>
                  </div>
                </button>
              </div>
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/admet-prediction" ? "active" : ""}`}
                  onClick={() => navigateTo("/admet-prediction")}
                  aria-current={activePath === "/admet-prediction" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">⚕️</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">ADMET Prediction</span>
                    <span className="nav-subitem-description">Evaluate absorption, distribution, metabolism, excretion, and toxicity.</span>
                  </div>
                </button>
              </div>
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/molecular-dynamics" ? "active" : ""}`}
                  onClick={() => navigateTo("/molecular-dynamics")}
                  aria-current={activePath === "/molecular-dynamics" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">⚙️</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">Molecular Dynamics</span>
                    <span className="nav-subitem-description">Simulate molecular interactions for drug design.</span>
                  </div>
                </button>
              </div>
            </AccordionItem>
            <AccordionItem
              title="Forecasting"
              isOpen={isPredictionOpen}
              onToggle={() => setIsPredictionOpen(!isPredictionOpen)}
            >
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/docking" ? "active" : ""}`}
                  onClick={() => navigateTo("/docking")}
                  aria-current={activePath === "/docking" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">⚡</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">Docking</span>
                    <span className="nav-subitem-description">Predict binding affinities with molecular docking.</span>
                  </div>
                </button>
              </div>
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/masking" ? "active" : ""}`}
                  onClick={() => navigateTo("/masking")}
                  aria-current={activePath === "/masking" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">💡</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">ChemBert</span>
                    <span className="nav-subitem-description">Use chemical language models for molecule prediction.</span>
                  </div>
                </button>
              </div>
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/protein2smiles" ? "active" : ""}`}
                  onClick={() => navigateTo("/protein2smiles")}
                  aria-current={activePath === "/protein2smiles" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">💻</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">Protein2Smiles</span>
                    <span className="nav-subitem-description">Convert protein sequences to SMILES strings.</span>
                  </div>
                </button>
              </div>
              <div className="nav-subitem-container">
                <button
                  className={`nav-subitem ${activePath === "/protein" ? "active" : ""}`}
                  onClick={() => navigateTo("/protein")}
                  aria-current={activePath === "/protein" ? "page" : undefined}
                >
                  <span className="nav-subitem-icon">📊</span>
                  <div className="nav-subitem-content">
                    <span className="nav-subitem-title">Protein Structure</span>
                    <span className="nav-subitem-description">Visualize and analyze 3D protein structures.</span>
                  </div>
                </button>
              </div>
            </AccordionItem>
            <button
              className={`nav-item ${activePath === "/profile" ? "active" : ""}`}
              onClick={() => navigateTo("/profile")}
              aria-current={activePath === "/profile" ? "page" : undefined}
            >
              My Profile
            </button>
            <button className="nav-item logout" onClick={handleLogoutClick}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;