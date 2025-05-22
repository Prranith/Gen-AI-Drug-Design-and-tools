// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import Dashboard from './pages/Dashboard';
// import DockingForm from './pages/DockingForm';
// import OTPVerificationPage from './pages/OTPVerificationPage';
// import MobileVerificationPage from './pages/MobileVerificationPage';
// import Protein2Smiles from './pages/Protein2Smiles';
// import Chembert from './pages/Chembert';
// import Reinforcement from './pages/reinforcement';
// import Diagnosis from './pages/Diagnosis';
// import LogP from './pages/LogP';
// import './styles/App.css';
// import Navbar from './components/Navbar';
// import VIT from './pages/Vit';
// import PrivateRoute from './components/PrivateRoute';
// import ProfilePage from './pages/ProfilePage';
// import Loading from './components/Loading';
// import ProteinStructure from './pages/ProteinStructure';
// import Visualization from './pages/Visualization';
// import PapayaViewer from './pages/PapayaViewer.jsx';
// import PapayaViewerPage from './pages/PapayaViewerPage.jsx';

// const App = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(null);

//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         setIsAuthenticated(!!token);
//     }, []);

//     const handleLoginSuccess = (token) => {
//         localStorage.setItem('authToken', token);
//         setIsAuthenticated(true);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
//         setIsAuthenticated(false);
//     };

//     if (isAuthenticated === null) {
//         return <Loading />;
//     }

//     return (
//         <Router>
//             <div className="app-container">
//                 <Routes>
//                     {/* Public Routes */}
//                     <Route path="/" element={<LandingPage />} />
//                     <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
//                     <Route path="/signup" element={<SignupPage />} />
//                     <Route path="/verify-otp" element={<OTPVerificationPage />} />
//                     <Route path="/verify-mobile" element={<MobileVerificationPage />} />
//                     <Route path="/upload" element={<PapayaViewer />} />

//                     {/* Protected Routes */}
//                     <Route
//                         element={
//                             <PrivateRoute isAuthenticated={isAuthenticated}>
//                                 <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
//                                 <Outlet />
//                             </PrivateRoute>
//                         }
//                     >
//                         <Route path="/dashboard" element={<Dashboard />} />
//                         <Route path="/protein2smiles" element={<Protein2Smiles />} />
//                         <Route path="/reinforcement" element={<Reinforcement />} />
//                         <Route path="/reinforcement2" element={<LogP />} />
//                         <Route path="/diagnosis" element={<Diagnosis />} />
//                         <Route path="/docking" element={<DockingForm />} />
//                         <Route path="/masking" element={<Chembert />} />
//                         <Route path="/protein" element={<ProteinStructure />} />
//                         <Route path="/vit" element={<VIT />} />
//                         <Route path="/profile" element={<ProfilePage />} />
//                         <Route path="/visualization" element={<Visualization />} />
//                         <Route path="/papaya" element={<PapayaViewerPage />} />
//                     </Route>

//                     {/* Catch-all Route */}
//                     <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// };

// export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import Dashboard from './pages/Dashboard';
// import DockingForm from './pages/DockingForm';
// import OTPVerificationPage from './pages/OTPVerificationPage';
// import MobileVerificationPage from './pages/MobileVerificationPage';
// import Protein2Smiles from './pages/Protein2Smiles';
// import Chembert from './pages/Chembert';
// import Reinforcement from './pages/Reinforcement';
// import Diagnosis from './pages/Diagnosis';
// import LogP from './pages/LogP';
// import './styles/App.css';
// import Navbar from './components/Navbar';
// import VIT from './pages/Vit';
// import PrivateRoute from './components/PrivateRoute';
// import ProfilePage from './pages/ProfilePage';
// import Loading from './components/Loading';
// import ProteinStructure from './pages/ProteinStructure';
// import Visualization from './pages/Visualization';
// import Upload from './pages/Upload';

// const App = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(null);

//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         setIsAuthenticated(!!token);
//     }, []);

//     const handleLoginSuccess = (token) => {
//         localStorage.setItem('authToken', token);
//         setIsAuthenticated(true);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
//         setIsAuthenticated(false);
//     };

//     if (isAuthenticated === null) {
//         return <Loading />;
//     }

//     return (
//         <Router>
//             <div className="app-container">
//                 <Routes>
//                     {/* Public Routes */}
//                     <Route path="/" element={<LandingPage />} />
//                     <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
//                     <Route path="/signup" element={<SignupPage />} />
//                     <Route path="/verify-otp" element={<OTPVerificationPage />} />
//                     <Route path="/verify-mobile" element={<MobileVerificationPage />} />
//                     <Route path="/upload" element={<Upload />} />

//                     {/* Protected Routes */}
//                     <Route
//                         element={
//                             <PrivateRoute isAuthenticated={isAuthenticated}>
//                                 <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
//                                 <Outlet />
//                             </PrivateRoute>
//                         }
//                     >
//                         <Route path="/dashboard" element={<Dashboard />} />
//                         <Route path="/protein2smiles" element={<Protein2Smiles />} />
//                         <Route path="/reinforcement" element={<Reinforcement />} />
//                         <Route path="/reinforcement2" element={<LogP />} />
//                         <Route path="/diagnosis" element={<Diagnosis />} />
//                         <Route path="/docking" element={<DockingForm />} />
//                         <Route path="/masking" element={<Chembert />} />
//                         <Route path="/protein" element={<ProteinStructure />} />
//                         <Route path="/vit" element={<VIT />} />
//                         <Route path="/profile" element={<ProfilePage />} />
//                         <Route path="/visualization" element={<Visualization />} />
//                         <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        
//                     </Route>

//                     {/* Catch-all Route */}
//                     <Route path="*" element={<Navigate to="/login" />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// };

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import DockingForm from './pages/DockingForm';
import OTPVerificationPage from './pages/OTPVerificationPage';
import MobileVerificationPage from './pages/MobileVerificationPage';
import Protein2Smiles from './pages/Protein2Smiles';
import Chembert from './pages/Chembert';
import Reinforcement from './pages/reinforcement';
import Diagnosis from './pages/Diagnosis';
import LogP from './pages/LogP';
import './styles/App.css';
import Navbar from './components/Navbar';
import VIT from './pages/Vit';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import Loading from './components/Loading';
import ProteinStructure from './pages/ProteinStructure';
import Visualization from './pages/Visualization';
import Upload from './pages/Upload';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleLoginSuccess = (token) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
    };

    if (isAuthenticated === null) {
        return <Loading />;
    }

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/verify-otp" element={<OTPVerificationPage />} />
                    <Route path="/verify-mobile" element={<MobileVerificationPage />} />
                    <Route path="/upload" element={<Upload />} />

                    {/* Protected Routes */}
                    <Route
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                                <Outlet />
                            </PrivateRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/protein2smiles" element={<Protein2Smiles />} />
                        <Route path="/reinforcement" element={<Reinforcement />} />
                        <Route path="/reinforcement2" element={<LogP />} />
                        <Route path="/diagnosis" element={<Diagnosis />} />
                        <Route path="/docking" element={<DockingForm />} />
                        <Route path="/masking" element={<Chembert />} />
                        <Route path="/protein" element={<ProteinStructure />} />
                        <Route path="/vit" element={<VIT />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/visualization" element={<Visualization />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>

                    {/* Catch-all Route */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;