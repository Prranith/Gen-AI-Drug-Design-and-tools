// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../styles/Navbar.css";
// import { FaBars, FaTimes } from "react-icons/fa";

// const Navbar = ({ isAuthenticated, onLogout }) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [activePath, setActivePath] = useState(location.pathname);
//     const [isDrugDesignOpen, setIsDrugDesignOpen] = useState(false);
//     const [isPredictionOpen, setIsPredictionOpen] = useState(false); // New state for Prediction dropdown
//     const drugDesignRef = useRef(null);
//     const predictionRef = useRef(null); // New ref for Prediction dropdown

//     useEffect(() => {
//         setActivePath(location.pathname);
//         setIsMobileMenuOpen(false);
//         setIsDrugDesignOpen(false);
//         setIsPredictionOpen(false); // Close Prediction dropdown on route change
//     }, [location]);

//     const handleLogoutClick = () => {
//         onLogout();
//         setIsMobileMenuOpen(false);
//         navigate('/login');
//     };

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//     };

//     const goToProfile = () => {
//         navigate('/profile');
//         setIsMobileMenuOpen(false);
//     };

//     const navigateTo = (path) => {
//         navigate(path);
//         setIsMobileMenuOpen(false);
//         setIsDrugDesignOpen(false);
//         setIsPredictionOpen(false); // Close Prediction dropdown on navigation
//     };

//     const toggleDrugDesignDropdown = () => {
//         setIsDrugDesignOpen(!isDrugDesignOpen);
//         setIsPredictionOpen(false); // Close other dropdown when this opens
//         console.log("isDrugDesignOpen toggled:", !isDrugDesignOpen); // Debugging
//     };

//     const togglePredictionDropdown = () => {
//         setIsPredictionOpen(!isPredictionOpen);
//         setIsDrugDesignOpen(false); // Close other dropdown when this opens
//         console.log("isPredictionOpen toggled:", !isPredictionOpen); // Debugging
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (drugDesignRef.current && !drugDesignRef.current.contains(event.target)) {
//                 setIsDrugDesignOpen(false);
//                 console.log("Clicked outside Drug Design, closing dropdown"); // Debugging
//             }
//             if (predictionRef.current && !predictionRef.current.contains(event.target)) {
//                 setIsPredictionOpen(false);
//                 console.log("Clicked outside Prediction, closing dropdown"); // Debugging
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [drugDesignRef, predictionRef]);

//     return (
//         <nav className="navbar">
//             <div
//                 className="navbar-title"
//                 onClick={() => navigateTo("/dashboard")}
//             >
//                 🔬 DRUGRIN ~ Revolutionizing drug discovery with AI.
//             </div>

//             {isAuthenticated && (
//                 <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
//                     {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
//                 </button>
//             )}

//             <div className={`button-container ${isMobileMenuOpen ? 'open' : ''}`}>
//                 <button
//                     className={`navbar-button ${activePath === '/dashboard' ? 'active' : ''}`}
//                     onClick={() => navigateTo("/dashboard")}
//                 >
//                     Home
//                 </button>
//                 <button
//                     className={`navbar-button ${activePath === '/diagnosis' ? 'active' : ''}`}
//                     onClick={() => navigateTo("/diagnosis")}
//                 >
//                     Diagnosis
//                 </button>
//                 <div className={`dropdown-container ${isDrugDesignOpen ? 'open' : ''}`} ref={drugDesignRef}>
//                     <button
//                         className={`navbar-button ${activePath === '/reinforcement' || activePath === '/reinforcement2' ? 'active' : ''} dropdown-toggle`}
//                         onClick={toggleDrugDesignDropdown}
//                     >
//                         Drug_Design
//                     </button>
//                     {isDrugDesignOpen && (
//                         <div className="dropdown-menu">
//                             <button
//                                 className={`dropdown-item ${activePath === '/reinforcement' ? 'active' : ''}`}
//                                 onClick={() => navigateTo("/reinforcement")}
//                             >
//                                 PIC50 Optimization
//                             </button>
//                             <button
//                                 className={`dropdown-item ${activePath === '/reinforcement2' ? 'active' : ''}`}
//                                 onClick={() => navigateTo("/reinforcement2")}
//                             >
//                                 LogP Optimization
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* New Prediction Dropdown */}
//                 <div className={`dropdown-container ${isPredictionOpen ? 'open' : ''}`} ref={predictionRef}>
//                     <button
//                         className={`navbar-button ${activePath === '/docking' || activePath === '/mask' || activePath === '/protein2smiles' ? 'active' : ''} dropdown-toggle`}
//                         onClick={togglePredictionDropdown}
//                     >
//                         Prediction
//                     </button>
//                     {isPredictionOpen && (
//                         <div className="dropdown-menu">
//                             <button
//                                 className={`dropdown-item ${activePath === '/docking' ? 'active' : ''}`}
//                                 onClick={() => navigateTo("/docking")}
//                             >
//                                 Docking
//                             </button>
//                             <button
//                                 className={`dropdown-item ${activePath === '/mask' ? 'active' : ''}`}
//                                 onClick={() => navigateTo("/masking")}
//                             >
//                                 ChemBert
//                             </button>
//                             <button
//                                 className={`dropdown-item ${activePath === '/protein2smiles' ? 'active' : ''}`}
//                                 onClick={() => navigateTo("/protein2smiles")}
//                             >
//                                 Protein2Smiles
//                             </button>
//                             <button
//                                 className={`dropdown-item ${activePath === '/protein' ? 'active' : ''}`}
//                                 onClick={() => navigateTo("/protein")}
//                             >
//                                 Protein Structure
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {isAuthenticated && (
//                     <button
//                         key="profile"
//                         className={`navbar-button ${activePath === '/profile' ? 'active' : ''}`}
//                         onClick={goToProfile}
//                     >
//                         Profile
//                     </button>
//                 )}
//                 {isAuthenticated && (
//                     // <button
//                     //     className="navbar-button logout-button"
//                     //     onClick={handleLogoutClick}
//                     // >   
//                     //     LOGOUT
//                     // </button>
//                     <button
//   style={{ marginRight: 'auto' }}
//   className="navbar-button logout-button"
//   onClick={handleLogoutClick}
// >
//   LOGOUT
// </button>

//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
    setIsSidebarOpen(false);
  }, [location]);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const AccordionItem = ({ title, children, isOpen, onToggle }) => (
    <div className="accordion-item">
      <button className="accordion-title" onClick={onToggle}>
        {title} {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );

  const [isDrugDesignOpen, setIsDrugDesignOpen] = useState(false);
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);

  return (
    <div className="nav-container">
      <button className="menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <div className="brand-title" onClick={() => navigateTo("/dashboard")}>
        🧪 Gen-AI Drug Design
      </div>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {isAuthenticated && (
          <>
            <button
              className={`nav-item ${activePath === "/dashboard" ? "active" : ""}`}
              onClick={() => navigateTo("/dashboard")}
            >
              Home
            </button>
            <button
              className={`nav-item ${activePath === "/diagnosis" ? "active" : ""}`}
              onClick={() => navigateTo("/diagnosis")}
            >
              Health Check
            </button>
            <AccordionItem
              title="Drug Creation"
              isOpen={isDrugDesignOpen}
              onToggle={() => setIsDrugDesignOpen(!isDrugDesignOpen)}
            >
              <button
                className={`nav-subitem ${activePath === "/reinforcement" ? "active" : ""}`}
                onClick={() => navigateTo("/reinforcement")}
              >
                PIC50 Optimization
              </button>
              <button
                className={`nav-subitem ${activePath === "/reinforcement2" ? "active" : ""}`}
                onClick={() => navigateTo("/reinforcement2")}
              >
                LogP Optimization
              </button>
            </AccordionItem>
            <AccordionItem
              title="Forecasting"
              isOpen={isPredictionOpen}
              onToggle={() => setIsPredictionOpen(!isPredictionOpen)}
            >
              <button
                className={`nav-subitem ${activePath === "/docking" ? "active" : ""}`}
                onClick={() => navigateTo("/docking")}
              >
                Docking
              </button>
              <button
                className={`nav-subitem ${activePath === "/mask" ? "active" : ""}`}
                onClick={() => navigateTo("/masking")}
              >
                ChemBert
              </button>
              <button
                className={`nav-subitem ${activePath === "/protein2smiles" ? "active" : ""}`}
                onClick={() => navigateTo("/protein2smiles")}
              >
                Protein2Smiles
              </button>
              <button
                className={`nav-subitem ${activePath === "/protein" ? "active" : ""}`}
                onClick={() => navigateTo("/protein")}
              >
                Protein Structure
              </button>
            </AccordionItem>
            <button
              className={`nav-item ${activePath === "/profile" ? "active" : ""}`}
              onClick={() => navigateTo("/profile")}
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