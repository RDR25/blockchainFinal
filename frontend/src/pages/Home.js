// =============================
// File: Home.js (Styled Full Version)
// Description: Full code with MUI styles, gradient, hover effects
// =============================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // Active section state
  const [activeSection, setActiveSection] = useState("login");

  // States for login forms and contact form
  const [userLoginUsername, setUserLoginUsername] = useState("");
  const [userLoginPassword, setUserLoginPassword] = useState("");
  const [officialLoginOfficialId, setOfficialLoginOfficialId] = useState("");
  const [officialLoginRole, setOfficialLoginRole] = useState("");
  const [officialLoginPassword, setOfficialLoginPassword] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Navigation
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // User login submit handler
  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userLoginUsername,
          password: userLoginPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/userdashboard');
      } else {
        alert(data.message || "User login failed");
      }
    } catch (error) {
      alert("An error occurred during user login");
    }
  };

  // Official login submit handler
const handleOfficialLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/official/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officialId: officialLoginOfficialId,
        role: officialLoginRole,
        password: officialLoginPassword
      })
    });
    const data = await response.json();
    if (response.ok) {
      // Assume the response returns an official object with a "role" property
      localStorage.setItem('official', JSON.stringify(data.official));
      const role = data.official.designation;
      // Redirect based on the official's role
      switch (role) {
        case "clerk":
          navigate("/clerkdashboard");
          break;
        case "mro":
          navigate("/mrodashboard");
          break;
        case "vro":
          navigate("/vrodashboard");
          break;
        case "ministry_welfare":
          navigate("/ministryofwelfaredashboard");
          break;
        case "district_collector":
          navigate("/districtcollectordashboard");
          break;
        case "joint_collector":
          navigate("/jointcollectordashboard");
          break;
        case "revenue_dept_officer":
          navigate("/rdodashboard");
          break;
        case "revenue_inspector":
          navigate("/revenueinspectordashboard");
          break;
        case "surveyor":
          navigate("/surveyordashboard");
          break;
        case "project_officer":
          navigate("/podashboard");
          break;
        case "superintendent":
          navigate("/superintendentdashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      alert(data.message || "Official login failed");
    }
  } catch (error) {
    alert("An error occurred during official login");
  }
};


  // Contact form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Message sent");
  };

  return (
    <div>
      {/* SINGLE INLINE STYLE BLOCK */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* RESET & BASE */
* {
  margin: 0; padding: 0; box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
body { background-color: #f0f2f5; color: #333; }

/* HEADER */
.blue-line {
  background: linear-gradient(135deg,rgb(10, 10, 10) 0%,rgb(2, 2, 2) 100%);
  color: white; padding: 25px 40px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.logo-container {
  display: flex; align-items: center; gap: 20px;
}
.logo-container img {
  width: 65px; height: 65px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  transition: transform 0.3s ease;
}
.logo-container img:hover { transform: scale(1.05) rotate(5deg); }
.title {
  font-size: 26px; font-weight: 600; letter-spacing: 0.5px;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}
.header-title {
  font-size: 44px; font-weight: 600; color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.15);
}

/* NAV */
.navbar {
  background: linear-gradient(135deg,rgb(31, 31, 31) 0%,rgb(47, 47, 48) 100%);
  padding: 20px 40px;
  display: flex; justify-content: space-between; align-items: center;
}
.nav-links {
  list-style: none; display: flex; gap: 30px;
}
.nav-links li a {
  color: white; text-decoration: none; font-size: 20px; font-weight: 500;
  padding: 12px 24px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
}
.nav-links li a:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* ABOUT SECTION */
.about-section { background: #f0f2f5; padding: 40px 0; }
.about-container {
  width: 90%; max-width: 1200px; margin: 0 auto; background: #fff;
  border-radius: 12px; padding: 40px; box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}
.about-title {
  font-size: 28px; font-weight: 600; color: #2c3e50;
  text-align: center; margin-bottom: 30px; position: relative;
}
.about-title-underline {
  display: block; width: 80px; height: 3px;
  background-color:rgb(0, 0, 0); margin: 10px auto 0;
  border-radius: 2px;
}
.about-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;
}
.about-card {
  background: #f8fafc; border-radius: 10px; padding: 25px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}
.about-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.about-card h3 {
  font-size: 20px; font-weight: 600; margin-bottom: 10px;
  display: flex; align-items: center;
}
.about-card h3 i { margin-right: 8px; }
.about-card p {
  font-size: 16px; color:rgb(51, 51, 51); line-height: 1.6;
}
.about-card ul {
  font-size: 16px; color:rgb(50, 50, 50); line-height: 1.6; padding-left: 25px; margin: 0;
}
.about-features-title {
  font-size: 20px; font-weight: 600; color:rgb(53, 53, 53);
  margin-bottom: 25px; text-align: center;
}
.about-features-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 20px; text-align: center;
}
.feature-box {
  background: #f8fafc; border-radius: 10px; padding: 25px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}
.feature-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.feature-box h4 {
  font-size: 18px; font-weight: 600; margin-bottom: 8px;
}
.feature-box p {
  font-size: 14px; color: #5f6b7a; line-height: 1.6;
}

/* SERVICES SECTION */
.services-section { background: #f0f2f5; padding: 40px 0; }
.services-container {
  width: 90%; max-width: 1200px; margin: 0 auto; background: #fff;
  border-radius: 12px; padding: 40px; box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}
.services-container h2 {
  font-size: 28px; font-weight: 600; color:rgb(0, 0, 0); text-align: center;
  margin-bottom: 30px;
}
.services-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;
}
.service-card {
  background: #f8fafc; border-radius: 10px; padding: 25px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}
.service-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.service-card h3 {
  font-size: 20px; font-weight: 600; margin-bottom: 10px;
  display: flex; align-items: center;
}
.service-card h3 i { margin-right: 6px; }
.service-card p, .service-card ul {
  font-size: 16px; color: #5f6b7a; line-height: 1.6;
}
.service-card ul {
  list-style: none; padding-left: 25px;
}
.service-card ul li {
  margin-bottom: 5px; position: relative;
}
.service-card ul li::before {
  content: '\\f101'; /* fa-angle-right icon */
  font-family: 'Font Awesome 5 Free'; font-weight: 900;
  position: absolute; left: -25px; color:rgb(0, 0, 0);
}
.service-features-title {
  font-size: 20px; font-weight: 600; color:rgb(7, 7, 7);
  margin-bottom: 25px; text-align: center;
}
.service-features-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;
}
.feature-item {
  background: #f8fafc; border-radius: 10px; padding: 25px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}
.feature-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.feature-item h4 {
  font-size: 18px; font-weight: 600; margin-bottom: 8px;
}
.feature-item p {
  font-size: 14px; color: #5f6b7a; line-height: 1.6;
}

/* CONTACT SECTION */
.contact-section { background: #f0f2f5; padding: 40px 0; }
.contact-container {
  width: 90%; max-width: 1200px; margin: 0 auto; background: #fff;
  border-radius: 12px; padding: 40px; box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}
.contact-container h2 {
  font-size: 28px; font-weight: 600; color:rgb(0, 0, 0); text-align: center;
  margin-bottom: 30px;
}
.contact-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
}
.contact-form h3 {
  font-size: 20px; font-weight: 600; margin-bottom: 15px; color: #2c3e50;
  display: flex; align-items: center;
}
.contact-form h3 i { margin-right: 6px; }
.form-group { margin-bottom: 15px; }
.form-group label {
  display: block; margin-bottom: 5px; font-weight: 600;
}
.form-group input, .form-group textarea {
  width: 100%; padding: 12px; font-size: 14px; border: 1px solid #ccc; border-radius: 8px;
}
.form-group textarea { resize: vertical; height: 100px; }
.submit-button {
  background: linear-gradient(135deg,rgb(24, 24, 24) 0%,rgb(0, 0, 0) 100%);
  color: #fff; border: none; padding: 12px 20px; border-radius: 8px;
  cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; gap: 8px;
  transition: 0.3s;
}
.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.contact-info { padding: 20px; }
.info-card {
  background: #f8fafc; border-radius: 10px; padding: 25px;
  margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.info-card i {
  font-size: 24px; color:rgb(0, 0, 0); margin-bottom: 8px;
}
.info-card h4 {
  font-size: 18px; font-weight: 600; margin-bottom: 6px;
}
.info-card p { font-size: 14px; line-height: 1.5; }

/* HELP SECTION */
.help-section { background: #f0f2f5; padding: 40px 0; }
.help-container {
  width: 90%; max-width: 1200px; margin: 0 auto; background: #fff;
  border-radius: 12px; padding: 40px; box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}
.help-title {
  font-size: 28px; font-weight: 600; color: #2c3e50;
  text-align: center; margin-bottom: 30px;
  display: flex; align-items: center; justify-content: center;
}
.help-title i { margin-right: 10px; }
.help-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;
}
.help-card {
  background: #f8fafc; border-radius: 10px; padding: 25px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  /* textAlign removed to left-align the content inside */
  text-align: left;
}
.help-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.help-card i {
  font-size: 28px; color:rgb(0, 0, 0); margin-bottom: 10px; margin-right: 8px;
}
.help-card h3 {
  font-size: 20px; font-weight: 600; margin-bottom: 10px;
  display: flex; align-items: center;
}
.help-card h3 i { margin-right: 8px; }
.help-card p,
.help-card ul {
  font-size: 16px; color: #5f6b7a; line-height: 1.6;
  /* ensure left alignment by default */
  text-align: left;
  margin-left: 5px;
}
.help-card ul {
  list-style: none; padding-left: 28px; margin-top: 10px;
}
.help-card ul li {
  position: relative; margin-bottom: 5px;
}
.help-card ul li::before {
  content: '\\f101'; /* fa-angle-right icon */
  font-family: 'Font Awesome 5 Free'; font-weight: 900;
  color:rgb(0, 0, 0); position: absolute; left: -25px;
}
.help-resources h3 {
  font-size: 20px; font-weight: 600; text-align: center; margin-bottom: 20px;
}
.resources-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
  text-align: center;
}
.resource-item {
  background: #f8fafc; border-radius: 10px; padding: 25px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}
.resource-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.resource-item i {
  font-size: 24px; color:rgb(0, 0, 0); margin-bottom: 8px; margin-right: 10px;
}
.resource-item span {
  font-size: 16px; font-weight: 500;
}

/* LOGIN SECTION */
.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 40px;
  gap: 60px; max-width: 1600px;
  margin: 0 auto; min-height: calc(100vh - 160px);
}
.login-box {
  background: #fff; padding: 50px; border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  width: 500px; min-height: 500px;
  display: flex; flex-direction: column; justify-content: space-between;
  transition: transform 0.3s ease;
}
.login-box:hover { transform: translateY(-5px); }
.login-box h2 {
  text-align: center; margin-bottom: 40px; color:rgb(0, 0, 0); font-size: 46px; font-weight: 600;
  position: relative;
}
.login-box h2::after {
  content: '';
  position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%);
  width: 80px; height: 4px;
  background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(12, 15, 15) 100%);
  border-radius: 2px;
}
.login-box input, .login-box select {
  width: 100%; padding: 15px 20px; border: 2px solid #e1e1e1; border-radius: 12px;
  font-size: 20px; transition: all 0.3s ease; margin-bottom: 20px;
}
.login-box input:focus, .login-box select:focus {
  border-color:rgb(0, 0, 0); outline: none;
  box-shadow: 0 0 0 3px rgba(33,147,176,0.1);
}
.login-box .button {
  background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(9, 11, 11) 100%);
  color: #fff; width: 100%; padding: 15px; border: none; border-radius: 12px;
  font-size: 22px; font-weight: 500; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  margin: 25px 0; transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(33,147,176,0.2);
}
.login-box .button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33,147,176,0.3);
}
.login-box .button i { font-size: 20px; }
.login-box p {
  text-align: center; margin-top: 20px; color: #666; font-size: 20px;
}
.login-box a {
  color:rgb(0, 0, 0); text-decoration: none; font-weight: 500; transition: color 0.3s ease;
}
.login-box a:hover { color:rgb(0, 0, 0); }
.forgot-password { margin-top: 15px; }
`
        }}
      />
{/* HEADER */}
<div className="blue-line">
        <div className="logo-container">
          <img src="/earth.png" alt="Logo" />
          <span className="title">E-Land Records</span>
        </div>
        <div className="header-title">E-Land Record Management System</div>
      </div>

      {/* NAVIGATION */}
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <a href="#home" onClick={() => handleSectionChange("login")}>
              <i className="fas fa-home"></i> Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={() => handleSectionChange("about")}>
              <i className="fas fa-info-circle"></i> About
            </a>
          </li>
          <li>
            <a href="#services" onClick={() => handleSectionChange("services")}>
              <i className="fas fa-cogs"></i> Services
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => handleSectionChange("contact")}>
              <i className="fas fa-envelope"></i> Contact
            </a>
          </li>
          <li>
            <a href="#help" onClick={() => handleSectionChange("help")}>
              <i className="fas fa-question-circle"></i> Help
            </a>
          </li>
        </ul>
      </nav>

      {/* ABOUT SECTION */}
      {activeSection === "about" && (
        <section className="about-section">
          <div className="about-container">
            <h2 className="about-title">
              About E-Land Records
              <span className="about-title-underline"></span>
            </h2>
            <div className="about-grid">
              {/* Our Mission */}
              <div className="about-card">
                <h3>
                  <i className="fas fa-bullseye"></i>
                  Our Mission
                </h3>
                <p>
                  To provide a transparent, efficient, and secure platform for
                  managing land records digitally, ensuring easy access and
                  reliability for all citizens.
                </p>
              </div>
              {/* Our Vision */}
              <div className="about-card">
                <h3>
                  <i className="fas fa-eye"></i>
                  Our Vision
                </h3>
                <p>
                  To revolutionize land record management through digital
                  transformation, making it hassle-free and accessible to
                  everyone.
                </p>
              </div>
              {/* Our Goals */}
              <div className="about-card">
                <h3>
                  <i className="fas fa-chart-line"></i>
                  Our Goals
                </h3>
                <ul>
                  <li><i className="fas fa-angle-right" style={{ marginRight: 6 }}></i>Digitize all land records</li>
                  <li><i className="fas fa-angle-right" style={{ marginRight: 6 }}></i>Reduce processing time</li>
                  <li><i className="fas fa-angle-right" style={{ marginRight: 6 }}></i>Enhance transparency</li>
                  <li><i className="fas fa-angle-right" style={{ marginRight: 6 }}></i>Improve accessibility</li>
                </ul>
              </div>
              {/* Security & Privacy */}
              <div className="about-card">
                <h3>
                  <i className="fas fa-shield-alt"></i>
                  Security &amp; Privacy
                </h3>
                <p>
                  We implement state-of-the-art security measures to protect
                  your data and ensure confidentiality of all land records.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <h3 className="about-features-title">Key Features</h3>
            <div className="about-features-grid">
              <div className="feature-box">
                <h4><i className="fas fa-digital" style={{ marginRight: 6 }}></i> Digital Records</h4>
                <p>All land records are digitized for easy storage and retrieval.</p>
              </div>
              <div className="feature-box">
                <h4><i className="fas fa-search" style={{ marginRight: 6 }}></i> Easy Search</h4>
                <p>Find records quickly using our powerful search functionality.</p>
              </div>
              <div className="feature-box">
                <h4><i className="fas fa-clock" style={{ marginRight: 6 }}></i> 24/7 Access</h4>
                <p>Access land records anytime, anywhere, with no downtime.</p>
              </div>
              <div className="feature-box">
                <h4><i className="fas fa-mobile-alt" style={{ marginRight: 6 }}></i> Mobile Friendly</h4>
                <p>Our platform is optimized for a seamless mobile experience.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES SECTION */}
      {activeSection === "services" && (
        <section className="services-section">
          <div className="services-container">
            <h2 className="services-title">Our Services</h2>
            <div className="services-grid">
              {/* Service 1 */}
              <div className="service-card">
                <h3>
                  <i className="fas fa-file-alt"></i>
                  Land Record Management
                </h3>
                <p>
                  Comprehensive digital management of land records ensuring accuracy and accessibility.
                </p>
                <ul>
                  <li>Digital record keeping</li>
                  <li>Secure storage</li>
                  <li>Easy retrieval</li>
                  <li>Version history</li>
                </ul>
              </div>
              {/* Service 2 */}
              <div className="service-card">
                <h3>
                  <i className="fas fa-search"></i>
                  Record Search &amp; Verification
                </h3>
                <p>
                  Quick search functionality to locate and verify land records with real-time validation.
                </p>
                <ul>
                  <li>Advanced search options</li>
                  <li>Real-time verification</li>
                  <li>Document authenticity</li>
                  <li>History tracking</li>
                </ul>
              </div>
              {/* Service 3 */}
              <div className="service-card">
                <h3>
                  <i className="fas fa-exchange-alt"></i>
                  Property Transfer
                </h3>
                <p>Streamlined process for transferring property ownership and updating records.</p>
                <ul>
                  <li>Online applications</li>
                  <li>Status tracking</li>
                  <li>Document verification</li>
                  <li>Digital signatures</li>
                </ul>
              </div>
              {/* Service 4 */}
              <div className="service-card">
                <h3>
                  <i className="fas fa-certificate"></i>
                  Certificate Generation
                </h3>
                <p>Automated generation of land-related certificates and documents in digital format.</p>
                <ul>
                  <li>Ownership certificates</li>
                  <li>Property details</li>
                  <li>Digital copies</li>
                  <li>Instant delivery</li>
                </ul>
              </div>
            </div>

            {/* Additional Features */}
            <h3 className="service-features-title">Additional Features</h3>
            <div className="service-features-grid">
              <div className="feature-item">
                <h4><i className="fas fa-mobile-alt" style={{ marginRight: 6 }}></i> Mobile Access</h4>
                <p>Access services on any device</p>
              </div>
              <div className="feature-item">
                <h4><i className="fas fa-clock" style={{ marginRight: 6 }}></i> 24/7 Availability</h4>
                <p>Services available round the clock</p>
              </div>
              <div className="feature-item">
                <h4><i className="fas fa-shield-alt" style={{ marginRight: 6 }}></i> Secure Platform</h4>
                <p>Enhanced security measures</p>
              </div>
              <div className="feature-item">
                <h4><i className="fas fa-headset" style={{ marginRight: 6 }}></i> Support</h4>
                <p>Dedicated customer support</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      {activeSection === "contact" && (
        <section className="contact-section">
          <div className="contact-container">
            <h2 className="contact-title">Contact Us</h2>
            <div className="contact-grid">
              {/* Contact Form */}
              <div className="contact-form">
                <h3>
                  <i className="fas fa-paper-plane" style={{ marginRight: 6 }}></i>
                  Send us a Message
                </h3>
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="contactName">Full Name</label>
                    <input
                      type="text"
                      id="contactName"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactEmail">Email Address</label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactSubject">Subject</label>
                    <input
                      type="text"
                      id="contactSubject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      required
                      placeholder="Enter subject"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactMessage">Message</label>
                    <textarea
                      id="contactMessage"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      placeholder="Enter your message"
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-button">
                    <i className="fas fa-paper-plane"></i> Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="contact-info">
                <div className="info-card">
                  <i className="fas fa-map-marker-alt"></i>
                  <h4>Our Location</h4>
                  <p>
                    123 Land Records Building
                    <br />
                    Main Street, City - 12345
                  </p>
                </div>
                <div className="info-card">
                  <i className="fas fa-phone-alt"></i>
                  <h4>Phone Number</h4>
                  <p>
                    +1 234 567 8900
                    <br />
                    +1 234 567 8901
                  </p>
                </div>
                <div className="info-card">
                  <i className="fas fa-envelope"></i>
                  <h4>Email Address</h4>
                  <p>
                    info@elandrecords.com
                    <br />
                    support@elandrecords.com
                  </p>
                </div>
                <div className="info-card">
                  <i className="fas fa-clock"></i>
                  <h4>Working Hours</h4>
                  <p>
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 9:00 AM - 1:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HELP SECTION */}
      {activeSection === "help" && (
        <section className="help-section">
          <div className="help-container">
            <h2 className="help-title">
              <i className="fas fa-question-circle"></i>
              Help &amp; Support
            </h2>
            <div className="help-grid">
              <div className="help-card">
                <h3>
                  <i className="fas fa-book"></i>
                  User Guide
                </h3>
                <p>
                  Learn how to use our platform effectively with our comprehensive user guide.
                </p>
                <ul>
                  <li>Registration Process</li>
                  <li>Document Upload</li>
                  <li>Record Search</li>
                  <li>Application Status</li>
                </ul>
              </div>
              <div className="help-card">
                <h3>
                  <i className="fas fa-question-circle"></i>
                  FAQs
                </h3>
                <p>Find answers to commonly asked questions about our services.</p>
                <ul>
                  <li>Account Management</li>
                  <li>Document Requirements</li>
                  <li>Processing Time</li>
                  <li>Payment Methods</li>
                </ul>
              </div>
              <div className="help-card">
                <h3>
                  <i className="fas fa-headset"></i>
                  Support Channels
                </h3>
                <p>Multiple ways to get in touch with our support team.</p>
                <ul>
                  <li>24/7 Helpline</li>
                  <li>Email Support</li>
                  <li>Live Chat</li>
                  <li>Support Ticket</li>
                </ul>
              </div>
              <div className="help-card">
                <h3>
                  <i className="fas fa-tools"></i>
                  Troubleshooting
                </h3>
                <p>Common issues and solutions to help you resolve problems quickly.</p>
                <ul>
                  <li>Login Issues</li>
                  <li>Upload Problems</li>
                  <li>Payment Errors</li>
                  <li>Technical Support</li>
                </ul>
              </div>
            </div>
            <div className="help-resources">
              <h3>Additional Resources</h3>
              <div className="resources-grid">
                <div className="resource-item">
                  <i className="fas fa-file-pdf"></i>
                  <span>User Manual</span>
                </div>
                <div className="resource-item">
                  <i className="fas fa-video"></i>
                  <span>Video Tutorials</span>
                </div>
                <div className="resource-item">
                  <i className="fas fa-newspaper"></i>
                  <span>Latest Updates</span>
                </div>
                <div className="resource-item">
                  <i className="fas fa-comments"></i>
                  <span>Community Forum</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LOGIN SECTION */}
      {activeSection === "login" && (
        <section className="login-container">
          {/* User Login */}
          <div className="login-box">
            <h2>
              <i  style={{ marginRight: 8 }}></i>
              User Login
            </h2>
            <form onSubmit={handleUserLogin} className="login-form">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userLoginUsername}
                  onChange={(e) => setUserLoginUsername(e.target.value)}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={userLoginPassword}
                  onChange={(e) => setUserLoginPassword(e.target.value)}
                  style={{ marginBottom: '60px' }}
                />
              </div>
              <div>
                <button
                  className="button"
                  type="submit"
                  style={{ marginBottom: '30px' }}
                >
                  <i className="fas fa-sign-in-alt"></i> Login
                </button>
                <p>
                  New User? <a href="/userregister">Register</a>
                </p>
                <p className="forgot-password">
                  <a href="/user-forgot-password">Forgot Password?</a>
                </p>
              </div>
            </form>
          </div>

          {/* Official Login */}
          <div className="login-box">
            <h2>
              <i  style={{ marginRight: 8 }}></i>
              Official Login
            </h2>
            <form onSubmit={handleOfficialLogin} className="login-form">
              <div>
                <input
                  type="text"
                  placeholder="Official ID"
                  name="officialId"
                  value={officialLoginOfficialId}
                  onChange={(e) => setOfficialLoginOfficialId(e.target.value)}
                />
                <select
                  name="role"
                  value={officialLoginRole}
                  onChange={(e) => setOfficialLoginRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="ministry_welfare">Ministry of Welfare</option>
                  <option value="district_collector">District Collector</option>
                  <option value="joint_collector">Joint Collector</option>
                  <option value="revenue_dept_officer">Revenue Department Officer</option>
                  <option value="revenue_inspector">Revenue Inspector</option>
                  <option value="vro">VRO (Village Revenue Officer)</option>
                  <option value="mro">MRO (Mandal Revenue Officer)</option>
                  <option value="surveyor">Surveyor</option>
                  <option value="project_officer">Project Officer</option>
                  <option value="superintendent">Superintendent</option>
                  <option value="clerk">Clerk</option>
                </select>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={officialLoginPassword}
                  onChange={(e) => setOfficialLoginPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  className="button"
                  type="submit"
                  style={{ marginBottom: '30px' }}
                >
                  <i ></i> Login
                </button>
                <p>
                  New Official? <a href="/officialregister">Register</a>
                </p>
                <p className="forgot-password">
                  <a href="/officia-forgot-password">Forgot Password?</a>
                </p>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
