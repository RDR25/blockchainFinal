import React from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationSuccess() {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div>
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

/* Header Styles (matching .blue-line etc.) */
.blue-line {
    background: linear-gradient(135deg,rgb(51, 52, 52),rgb(0, 0, 0) 100%);
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
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
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
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
.header-title {
    font-size: 44px; /* Increased from 40px */
    font-weight: 600;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
    letter-spacing: 0.5px;
    color: white;
}

/* 
   We'll reuse a "success-container" to center the message, 
   and a box style similar to .login-box or .register-box. 
*/
.success-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 160px); /* offset for header height */
    padding: 20px;
}

/* Create a 'success-box' similar to .register-box or .login-box */
.success-box {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    width: 500px;
    max-width: 90%;
    text-align: center;
    transition: transform 0.3s ease;
}
.success-box:hover {
    transform: translateY(-5px);
}
.success-box h1 {
    font-size: 32px;
    color:rgb(0, 0, 0);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.success-box p {
    font-size: 20px;
    color: #333;
    margin-bottom: 30px;
}

/* EXACT Button style from style.css's .register-button or similar */
.register-button {
    background: linear-gradient(135deg,rgb(15, 16, 16) 0%,rgb(67, 67, 67) 100%);
    color: white;
    width: auto;
    padding: 15px;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(33, 147, 176, 0.2);
}
.register-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 147, 176, 0.3);
}
.register-button i {
    font-size: 20px;
}

/* ------------------ END OF style.css CONTENT ------------------ */
        `,
        }}
      />

      {/* Header */}
      <header className="blue-line">
        <div className="logo-container">
          <img src="earth.png" alt="Logo" />
          <span className="title">E-Land Records</span>
        </div>
        <div className="header-title">Land Record Management System</div>
      </header>

      {/* Success container */}
      <div className="success-container">
        <div className="success-box">
          <h1>
            <i className="fas fa-check-circle" style={{ color: 'rgb(15, 16, 16)' }}></i>
            Congratulations!
          </h1>
          {/* Bold & Green text for “Registration Successful” */}
          <p style={{ color: '#rgb(15, 16, 16)', fontWeight: 'bold' }}>Registration Successful</p>

          {/* Button with the .register-button style from style.css */}
          <button className="register-button" onClick={handleReturnHome}>
            <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
            Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSuccess;
