import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserRegistration() {
  // -------------------- States --------------------
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  // OTP states
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // Additional states
  const [message, setMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // -------------------- Effects --------------------
  // Start OTP countdown timer
  useEffect(() => {
    let timerInterval = null;
    if (otpSent) {
      setOtpTimer(120);
      timerInterval = setInterval(() => {
        setOtpTimer(prev => {
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

  // Format OTP timer as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // -------------------- Handlers --------------------
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

  const handleSendOtp = async () => {
    setMessage('');
    setUsernameError('');

    // Check required fields
    if (
      !username || !password || !firstName || !lastName || !gender ||
      !dob || !phone || !email || !address || !aadhar
    ) {
      setMessage('Please fill all required fields before requesting OTP.');
      return;
    }

    // Check if username is taken
    try {
      const checkRes = await fetch('http://localhost:5000/api/users/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const checkData = await checkRes.json();
      if (!checkData.available) {
        setUsernameError('Username already taken');
        return;
      }
    } catch (err) {
      console.error('Username check failed', err);
      setMessage('Error checking username. Try again.');
      return;
    }

    // Send OTP
    try {
      const response = await fetch('http://localhost:5000/api/email/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('OTP sent successfully to your email.');
        setOtpSent(true);
        setServerOtp(data.otp?.toString() || '');
      } else {
        setMessage(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while sending OTP.');
    }
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      if (value && index < otp.length - 1 && otpRefs.current[index + 1]) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Basic validations
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    if (aadhar.length !== 12 || isNaN(aadhar)) {
      setMessage('Please enter a valid 12-digit Aadhar number!');
      return;
    }
    const otpCode = otp.join('');
    if (!otpSent || otpCode.length !== 6) {
      setMessage('Please enter the 6-digit OTP sent to your email.');
      return;
    }
    if (otpCode !== serverOtp) {
      setMessage('Invalid OTP entered. Please try again.');
      return;
    }

    // Send form data
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('firstname', firstName);
      formData.append('middlename', middleName);
      formData.append('lastname', lastName);
      formData.append('gender', gender);
      formData.append('dateofbirth', dob);
      formData.append('phonenumber', phone);
      formData.append('email', email);
      formData.append('residentialaddress', address);
      formData.append('aadharnumber', aadhar);
      if (profilePicture) formData.append('photo', profilePicture);

      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful!');
        navigate('/registrationsuccess');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage(err + ' An error occurred during registration.');
    }
  };

  return (
    <div>
      {/* 
         1) Insert entire style.css content in a single <style> block
         2) Use the classes from style.css to style everything
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ---------------- START OF FINAL UPDATED style.css CONTENT ---------------- */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 18px;
}

body {
    background: linear-gradient(145deg, #cfd9df, #e2ebf0);
    line-height: 1.6;
    color: #333;
    min-height: 100vh;
    padding-bottom: 100px; /* ✅ ensures scroll at bottom */
}

header {
    background: linear-gradient(to right, #434343, #000000);
    color: white;
    padding: 25px 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.logo-title {
    display: flex;
    align-items: center;
    gap: 20px;
}

.logo-title img {
    width: 65px;
    height: 65px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease;
}

.logo-title img:hover {
    transform: scale(1.05) rotate(5deg);
}

.logo-title h1 {
    font-size: 38px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: linear-gradient(to right, #ffffff, #e0e0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title {
    font-size: 44px;
    font-weight: 600;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
    letter-spacing: 0.5px;
    color: white;
}

nav {
    background: linear-gradient(to bottom, #868f96, #596164);
    padding: 20px 40px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

nav ul {
    list-style: none;
    display: flex;
    gap: 30px;
}

nav ul li a {
    color: white;
    text-decoration: none;
    font-size: 20px;
    font-weight: 500;
    padding: 12px 24px;
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

nav ul li a:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.register-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
    min-height: 100%; /* ✅ added to stretch full height */
}

.register-box {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.register-box h2 {
    text-align: center;
    margin-bottom: 40px;
    color: #2c3e50;
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
    background: linear-gradient(to right, #434343, #000000);
    border-radius: 2px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

.form-section {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 15px;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.form-section h3 {
    color: #2c3e50;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-section h3 i {
    color: #434343;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e1e1e1;
    border-radius: 10px;
    font-size: 20px;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #434343;
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 67, 67, 0.1);
}

.form-group textarea {
    height: 100px;
    resize: vertical;
}

.full-width {
    grid-column: span 2;
}

.required {
    color: #ff4757;
    margin-left: 4px;
}

.register-button {
    background: linear-gradient(to right, #434343, #000000);
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
    margin-top: 20px;
}

.register-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(67, 67, 67, 0.3);
}

.register-button i {
    font-size: 20px;
}

.login-link {
    text-align: center;
    margin-top: 25px;
    color: #666;
    font-size: 15px;
}

.login-link a {
    color: #434343;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.login-link a:hover {
    color: #000000;
}

.otp-box {
    width: 50px;
    height: 50px;
    border: 2px solid #e1e1e1;
    border-radius: 8px;
    font-size: 24px;
    text-align: center;
    transition: all 0.3s ease;
    font-weight: 600;
}

/* ---------------- END OF FINAL UPDATED style.css CONTENT ---------------- */
`        }}
      />

      {/* Header from style.css */}
      <header className="header">
        <div className="logo-title">
          <img src="earth.png" alt="Logo" />
          <h1>E-Land Records</h1>
        </div>
        <div className="header-title">Land Record Management System</div>
      </header>

      {/* Registration Container + Registration Box from style.css */}
      <div className="register-container">
        <div className="register-box">
          <h2>User Registration</h2>
          {message && (
            <p style={{ marginBottom: '15px', color: '#333', fontSize: '16px' }}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Personal Info Section */}
              <div className="form-section">
                <h3>
                  <i className="fas fa-user"></i> Personal Information
                </h3>

                <div className="form-group">
                  <label htmlFor="first-name">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="middle-name">Middle Name</label>
                  <input
                    type="text"
                    id="middle-name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last-name">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dob">
                    Date of Birth <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">
                    Gender <span className="required">*</span>
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    style={{ appearance: 'none' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Profile Picture */}
                <div className="form-group">
                  <label htmlFor="profile-picture">Profile Picture</label>
                  <label
                    htmlFor="profile-picture"
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg,  #434343, #000000 100%)',
                      color: 'white',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      marginTop: '5px'
                    }}
                  >
                    <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {profilePicture && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <img
                        src={URL.createObjectURL(profilePicture)}
                        alt="Preview"
                        style={{
                          maxWidth: '150px',
                          maxHeight: '150px',
                          borderRadius: '50%',
                          display: 'block',
                          margin: '0 auto 10px'
                        }}
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
                          fontSize: '14px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="form-section">
                <h3>
                  <i className="fas fa-address-card"></i> Contact Information
                </h3>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="aadhar">
                    Aadhar Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="aadhar"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value)}
                    required
                    maxLength="12"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">
                    Residential Address <span className="required">*</span>
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    style={{ resize: 'vertical', height: '100px' }}
                  />
                </div>
              </div>

              {/* Account Security (full width) */}
              <div className="form-section full-width">
                <h3>
                  <i className="fas fa-lock"></i> Account Security
                </h3>

                <div className="form-group">
                  <label htmlFor="username">
                    Username <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError('');
                    }}
                    required
                  />
                  {usernameError && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                      {usernameError}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* OTP Verification (full width) */}
              <div className="form-section full-width">
                <h3>
                  <i className="fas fa-shield-alt"></i> Identity Verification
                </h3>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{
                    background: 'linear-gradient(135deg,  #434343, #000000 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '15px',
                    width: '100%'
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                  Send OTP to Mail
                </button>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  marginTop: '10px'
                }}>
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
                <div style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  Time remaining: {' '}
                  <span style={{ color: '#2193b0', fontWeight: 600 }}>
                    {formatTime(otpTimer)}
                  </span>
                </div>
              </div>
            </div>

            <button type="submit" className="register-button">
              <i className="fas fa-user-plus"></i> Create User Account
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;
