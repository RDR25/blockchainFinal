import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserForgotPassword() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/forgotpassword/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP sent to your registered email.");
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error sending OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/forgotpassword/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, otp })
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP verified. Please set your new password.");
        setStep(3);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error verifying OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch('/api/user/forgotpassword/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password updated successfully");
        // Redirect to login page
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error resetting password");
    }
  };

  return (
    <div>
      {/* Inline style block containing your entire style.css content */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ------------------ START OF style.css CONTENT ------------------ */

/* Global Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 18px; /* Increased from 16px */
}

body {
    background-color: #f0f2f5;
    line-height: 1.6;
    color: #333;
    min-height: 100vh;
    font-size: 18px; /* Increased from 16px */
}

/* Header (.blue-line) */
.blue-line {
    background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(72, 73, 73) 100%);
    color: white;
    padding: 25px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 100;
}
.logo-container {
    display: flex;
    align-items: center;
    gap: 20px;
}
.logo-container img {
    width: 65px;
    height: 65px;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    transition: transform 0.3s ease;
}
.logo-container img:hover {
    transform: scale(1.05) rotate(5deg);
}
.title {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: linear-gradient(to right, #ffffff, #e0e0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}
.header-title {
    font-size: 44px; /* Increased from 40px */
    font-weight: 600;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.15);
    letter-spacing: 0.5px;
    color: white;
}

/* Navigation */
.navbar {
    background: linear-gradient(135deg,rgb(31, 31, 31) 0%,rgb(47, 47, 48) 100%);
    padding: 20px 40px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.nav-links {
    list-style: none;
    display: flex;
    gap: 30px;
    margin: 0; padding: 0;
}
.nav-links li a {
    color: white;
    text-decoration: none;
    font-size: 20px; /* Increased from 18px */
    font-weight: 500;
    padding: 12px 24px;
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.2);
}
.nav-links li a:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Forgot Password Container (similar to .login-container or .register-container) */
.login-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 50px 40px;
    gap: 60px;
    max-width: 1600px;
    margin: 0 auto;
    min-height: calc(100vh - 160px);
}

/* We can create a single .login-box for the forgot password forms */
.login-box {
    background: white;
    padding: 50px;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    width: 660px;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.3s ease;
}
.login-box:hover {
    transform: translateY(-5px);
}
.login-box h2 {
    text-align: center;
    margin-bottom: 40px;
    color: #2c3e50;
    font-size: 46px; /* Increased from 42px */
    font-weight: 600;
    position: relative;
}
.login-box h2::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(43, 43, 43) 100%);
    border-radius: 2px;
}

.login-box form {
    display: flex;
    flex-direction: column;
    gap: 25px;
    flex: 1;
}
.login-box .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.login-box .form-group label {
    font-size: 16px;
    color:rgb(0, 0, 0);
    display: flex;
    align-items: center;
    gap: 5px;
}
.login-box .form-group input {
    width: 100%;
    padding: 15px 20px;
    border: 2px solid #e1e1e1;
    border-radius: 12px;
    font-size: 20px; /* Increased from 18px */
    transition: all 0.3s ease;
}
.login-box .form-group input:focus {
    border-color:rgb(0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.1);
}

.login-box button {
    background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(40, 41, 41) 100%);
    color: white;
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 12px;
    font-size: 22px; /* Increased from 20px */
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: auto;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(15, 15, 15, 0.2);
}
.login-box button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(90, 90, 90, 0.3);
}
.login-box button i {
    font-size: 20px;
}

/* Responsive adjustments (similar to style.css) */
@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
        gap: 40px;
        padding: 30px 20px;
    }
    .login-box {
        width: 100%;
        padding: 30px 25px;
    }
    .login-box h2 {
        font-size: 40px; /* Adjust for mobile */
    }
    .login-box .form-group input {
        font-size: 16px;
    }
    .login-box button {
        font-size: 18px;
    }
}

/* ------------------ END OF style.css CONTENT ------------------ */
        `
        }}
      />

      {/* Header */}
      <div className="blue-line">
        <div className="logo-container">
          <img src="/earth.png" alt="Logo" />
          <span className="title">E-Land Records</span>
        </div>
        <div className="header-title">E-Land Record Management System</div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <ul className="nav-links">
          <li><a href="/"><i className="fas fa-home"></i> Home</a></li>
          <li><a href="/about"><i className="fas fa-info-circle"></i> About</a></li>
          <li><a href="/services"><i className="fas fa-cogs"></i> Services</a></li>
          <li><a href="/contact"><i className="fas fa-envelope"></i> Contact</a></li>
          <li><a href="/help"><i className="fas fa-question-circle"></i> Help</a></li>
        </ul>
      </nav>

      {/* MAIN Container for Forgot Password - using .login-container style */}
      <div className="login-container">
        {/* We can show different steps in the same box, just changing the form content */}
        <div className="login-box">
          <h2><i className="fas fa-user" style={{ marginRight: 8 }}></i> Reset Password</h2>

          {/* STEP 1: Request OTP */}
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label htmlFor="username">
                  <i className="fas fa-user"></i> Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <button type="submit">
                <i className="fas fa-paper-plane"></i> Send OTP
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label htmlFor="otp">
                  <i className="fas fa-key"></i> OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit">
                <i className="fas fa-check"></i> Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="newPassword">
                  <i className="fas fa-lock"></i> New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <i className="fas fa-lock"></i> Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">
                <i className="fas fa-redo"></i> Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserForgotPassword;
