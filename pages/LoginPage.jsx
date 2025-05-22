// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/LoginPage.css';

// const LoginPage = ({ onLoginSuccess }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (username && password) {
//       try {
//         const response = await axios.post(
//           'http://localhost:5000/api/auth/login',
//           { username, password },
//           { withCredentials: true }
//         );

//         if (response.data.success) {
//           setMessage('Login successful!');
//           onLoginSuccess(response.data.token); // Pass the token back to App
//           navigate('/dashboard');
//         } else {
//           setMessage('Invalid credentials.');
//         }
//       } catch (error) {
//         console.error('Error during login:', error);
//         setMessage('An error occurred. Please try again.');
//       }
//     } else {
//       setMessage('Please enter both username and password.');
//     }
//   };

//   const handleSignUpRedirect = () => {
//     navigate('/signup');
//   };

//   return (
//     <div className="login-container">
//       <div className="login-overlay"></div>

//       <div className="login-form-container">
//         <h2 className="login-title">LOGIN</h2>
//         <form onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="login-input"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="login-input"
//             required
//           />
//           <button type="submit" className="login-button">
//             Login
//           </button>
//         </form>
//         {message && <p className="login-error-message">{message}</p>}
//         <p className="login-signup-link" onClick={handleSignUpRedirect}>
//           Don't have an account? Sign up
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          { username, password },
          { withCredentials: true }
        );

        if (response.data.success) {
          setMessage('Login successful!');
          onLoginSuccess(response.data.token);
          navigate('/dashboard');
        } else {
          setMessage('Invalid credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setMessage('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setMessage('Please enter both username and password.');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <span className="input-icon"></span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        <div className="input-group">
          <span className="input-icon"></span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    );
  };

  return (
    <div className="med-auth-wrapper">
      <div className="med-auth-overlay"></div>
      <div className="med-auth-card">
        <div className="logo-container">
          <span className="logo-icon">🩺</span>
          <h2 className="auth-title">Gen-AI Med Diagnosis</h2>
          <p className="auth-subtitle">AI-Powered Medical Insights</p>
        </div>
        <div className="tab-nav">
          <button className="tab-active">
            Login
          </button>
          <button onClick={handleSignUpRedirect}>
            Signup
          </button>
        </div>
        {renderForm()}
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;