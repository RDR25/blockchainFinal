import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OfficialRegistration() {
  // ---------- State variables ----------
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [dateofbirth, setDateofbirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [officialid, setOfficialid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [officialIdExists, setOfficialIdExists] = useState(false);

  // OTP states
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // General message state
  const [message, setMessage] = useState('');

  // Refs & navigation
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  // ---------- Effects ----------
  // If OTP is sent, start a 2-minute timer
  useEffect(() => {
    let timerInterval;
    if (otpSent) {
      setOtpTimer(120);
      timerInterval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [otpSent]);

  // ---------- Handlers ----------
  // Check whether official ID already exists
  const checkOfficialIdExists = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/official/check-officialid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officialid }),
      });
      const data = await response.json();
      setOfficialIdExists(data.exists);
      return data.exists;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // File upload (profile picture)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setProfilePicture(file);
        setMessage('');
      } else {
        setMessage('Please upload an image in PNG or JPEG format.');
      }
    }
  };
  const handleCancelProfilePic = () => {
    setProfilePicture(null);
  };

  // Send OTP
  const handleSendOtp = async () => {
    setMessage('');
    // Validate required fields
    if (
      !officialid || !password || !firstName || !lastName || !designation ||
      !gender || !dateofbirth || !phone || !email
    ) {
      setMessage('Please fill all required fields.');
      return;
    }
    // Check if official ID is taken
    const exists = await checkOfficialIdExists();
    if (exists) {
      setMessage('Official ID already exists.');
      return;
    }
    // Request OTP
    try {
      const response = await fetch('http://localhost:5000/api/official/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officialid,
          password,
          firstname: firstName,
          lastname: lastName,
          designation,
          gender,
          dateofbirth,
          phonenumber: phone,
          email
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('OTP sent successfully to your email.');
        setOtpSent(true);
      } else {
        setMessage(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error sending OTP.');
    }
  };

  // OTP change
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      // auto-focus next box
      if (value && index < otp.length - 1 && otpRefs.current[index + 1]) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  // Submitting final form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    // Password check
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    // OTP check
    const otpCode = otp.join('');
    if (!otpSent || otpCode.length !== 6) {
      setMessage('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    // Build form data
    const formData = new FormData();
    formData.append('officialid', officialid);
    formData.append('password', password);
    formData.append('firstname', firstName);
    formData.append('middlename', middleName);
    formData.append('lastname', lastName);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('dateofbirth', dateofbirth);
    formData.append('phonenumber', phone);
    formData.append('email', email);
    formData.append('otp', otpCode);
    if (profilePicture) {
      formData.append('photo', profilePicture);
    }

    // POST to server
    try {
      const res = await fetch('http://localhost:5000/api/official/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Registration successful!');
        navigate('/registrationsuccess');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred during registration.');
    }
  };

  // Format OTP timer as mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div>
      {/* 
        1) Insert your entire style.css content in a single <style> block
        2) Use classes from style.css to style everything
      */}
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

/* Header - .blue-line, .logo-container, .title, .header-title */
.blue-line {
    background: linear-gradient(135deg,rgb(52, 52, 52) 0%,rgb(19, 20, 20) 100%);
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

/* Navigation bar - .navbar, .nav-links */
.navbar {
    background: linear-gradient(135deg,rgb(30, 30, 30) 0%,rgb(15, 15, 15) 100%);
    padding: 20px 40px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
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
    background: rgba(21, 20, 20, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Official Registration Container - .register-container + .register-box */
.register-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
}
.register-box {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}
.register-box h2 {
    text-align: center;
    margin-bottom: 40px;
    color:rgb(32, 32, 32);
    font-size: 32px;
    font-weight: 600;
    position: relative;
}
.register-box h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(31, 31, 31) 100%);
    border-radius: 2px;
}

/* .form-grid to create columns, .form-section for each block */
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}
.form-section {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 15px;
    border: 1px solid rgba(0,0,0,0.05);
}
.form-section h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    color:rgb(18, 19, 19);
    display: flex;
    align-items: center;
    gap: 8px;
}
.full-width {
    grid-column: span 2;
}

/* Inputs */
.form-section label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color:rgb(0, 0, 0);
}
.form-section select,
.form-section input[type="text"],
.form-section input[type="email"],
.form-section input[type="tel"],
.form-section input[type="date"],
.form-section input[type="password"],
.form-section textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e1e1e1;
    border-radius: 10px;
    font-size: 20px; /* Increased from 18px */
    transition: all 0.3s ease;
    margin-bottom: 20px;
}
.form-section input:focus,
.form-section select:focus,
.form-section textarea:focus {
    border-color:rgb(0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 3px rgba(23, 23, 23, 0.1);
}

/* Final button .register-button style from style.css */
.register-button {
    background: linear-gradient(135deg,rgb(6, 6, 6) 0%,rgb(48, 49, 49) 100%);
    color: white;
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    margin-top: 30px;
    box-shadow: 0 4px 15px rgba(45, 46, 46, 0.2);
}
.register-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(25, 25, 25, 0.3);
}
.register-button i {
    font-size: 20px;
}

/* OTP fields, similar to .otp-box usage from style.css */
.otp-box {
    width: 50px;
    height: 50px;
    border: 2px solid #e1e1e1;
    border-radius: 10px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    box-sizing: border-box;
    margin-right: 5px;
}

/* .login-link or .register-link styling at bottom */
.login-link {
    text-align: center;
    margin-top: 25px;
    color: #666;
    font-size: 15px;
}
.login-link a {
    color:rgb(20, 20, 20);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}
.login-link a:hover {
    color:rgb(33, 33, 33);
}

/* Media queries from style.css if needed */
@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
    .full-width {
        grid-column: auto;
    }
    .register-box {
        padding: 30px 20px;
    }
    .form-section {
        padding: 20px;
    }
}

/* ------------------ END OF style.css CONTENT ------------------ */
          `
        }}
      />

      {/* Header */}
      <div className="blue-line">
        <div className="logo-container">
          <img src="earth.png" alt="Logo" />
          <span className="title">E-Land Records</span>
        </div>
        <div className="header-title">Land Record Management System</div>
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

      {/* Official Registration container */}
      <div className="register-container">
        <div className="register-box">
          <h2>
            <i className="fas fa-user-shield" style={{ marginRight: 8 }}></i>
            Official Registration
          </h2>
          {message && (
            <p style={{ color: '#cc0000', marginBottom: '15px', fontSize: '16px' }}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="form-grid" encType="multipart/form-data">
            {/* Officer Info Section */}
            <div className="form-section">
              <h3>
                <i className="fas fa-id-badge"></i> Officer Information
              </h3>

              <label>First Name <span style={{ color: '#ff4757' }}>*</span></label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <label>Middle Name</label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />

              <label>Last Name <span style={{ color: '#ff4757' }}>*</span></label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <label>Designation <span style={{ color: '#ff4757' }}>*</span></label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              >
                <option value="">Select Designation</option>
                <option value="ministry_welfare">Ministry of Welfare</option>
                <option value="district_collector">District Collector</option>
                <option value="joint_collector">Joint Collector</option>
                <option value="revenue_dept_officer">Revenue Department Officer</option>
                <option value="project_officer">Project Officer</option>
                <option value="mro">MRO</option>
                <option value="surveyor">Surveyor</option>
                <option value="revenue_inspector">Revenue Inspector</option>
                <option value="vro">VRO</option>
                <option value="superintendent">Superintendent</option>
                <option value="clerk">Clerk</option>
              </select>

              <label>Gender <span style={{ color: '#ff4757' }}>*</span></label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <label>Date of Birth <span style={{ color: '#ff4757' }}>*</span></label>
              <input
                type="date"
                value={dateofbirth}
                onChange={(e) => setDateofbirth(e.target.value)}
                required
              />

              {/* Profile Picture Upload */}
              <label>Upload Profile Picture</label>
              <label
                htmlFor="profile-upload"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgb(0, 0, 0)',
                  color: 'white',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '15px'
                }}
              >
                <i className="fas fa-upload" style={{ marginRight: 6 }}></i>
                Choose File
              </label>
              <input
                type="file"
                id="profile-upload"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {profilePicture && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile Preview"
                    style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%' }}
                  />
                  <button
                    type="button"
                    onClick={handleCancelProfilePic}
                    style={{
                      backgroundColor: '#ff4757',
                      color: 'white',
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginTop: '10px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Contact Details Section */}
            <div className="form-section">
              <h3>
                <i className="fas fa-phone"></i> Contact Details
              </h3>

              <label>Official Email <span style={{ color: '#ff4757' }}>*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Phone Number <span style={{ color: '#ff4757' }}>*</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <label>Official ID <span style={{ color: '#ff4757' }}>*</span></label>
              <input
                type="text"
                value={officialid}
                onChange={(e) => {
                  setOfficialid(e.target.value);
                  setOfficialIdExists(false);
                }}
                required
                style={{ borderColor: officialIdExists ? '#cc0000' : '#e1e1e1' }}
              />
              {officialIdExists && (
                <p style={{ color: '#cc0000', fontSize: '14px' }}>Official ID already taken</p>
              )}
            </div>

            {/* Account Security (full width) */}
            <div className="form-section full-width">
              <h3>
                <i className="fas fa-lock"></i> Account Security
              </h3>

              <label>Password <span style={{ color: '#ff4757' }}>*</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label>Confirm Password <span style={{ color: '#ff4757' }}>*</span></label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* OTP Verification (full width) */}
            <div className="form-section full-width">
              <h3>
                <i className="fas fa-shield-alt"></i> OTP Verification
              </h3>
              <button
                type="button"
                onClick={handleSendOtp}
                style={{
                  background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(62, 64, 64) 100%)',
                  color: 'white',
                  width: '100%',
                  padding: '15px',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-paper-plane"></i>
                Send OTP to Mail
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    ref={(el) => (otpRefs.current[index] = el)}
                  />
                ))}
              </div>
              {otpSent && (
                <div style={{ textAlign: 'center', marginTop: '5px', color: '#666' }}>
                  Time remaining: {' '}
                  <span style={{ color: '#0056b3', fontWeight: 600 }}>{formatTime(otpTimer)}</span>
                </div>
              )}
            </div>

            
            <div className="full-width">
            <button type="submit" className="register-button">
              <i className="fas fa-user-plus"></i> Create Official Account
            </button>
            </div>
          </form>


          <p className="login-link">
            Already have an account? <a href="/">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OfficialRegistration;
