import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [maximizedWidget, setMaximizedWidget] = useState(null);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Maximize / restore a widget
  const handleMaximize = (widgetName) => {
    setMaximizedWidget((prev) => (prev === widgetName ? null : widgetName));
  };

  // Return the correct widget class
  const getWidgetClass = (widgetName) => {
    if (maximizedWidget === widgetName) {
      return "rectangle maximized";
    } else if (maximizedWidget) {
      return "rectangle hidden";
    } else {
      return "rectangle";
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ------------------ START OF style.css CONTENT (UPDATED) ------------------ */

/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 18px;
}
body {
  background-color: #f0f2f5;
  min-height: 100vh;
  color: #333;
}

/* Header (.blue-line) */
.blue-line {
  background: linear-gradient(135deg,rgb(67, 66, 66) 0%,rgb(18, 17, 17) 100%);
  color: white;
  padding: 25px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  height: 80px; /* If you want the header to be 80px tall */
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
  font-size: 44px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.15);
  color: white;
}

/* Dashboard Container: .dashboard-container as a flex layout */
.dashboard-container {
  display: flex;
  /* no extra margin or offset, so it sits immediately below the header */
  min-height: calc(100vh - 80px); /* if header is 80px tall */
}

/* Sidebar in normal flow (not fixed) */
.sidebar {
  width: 300px;
  background: linear-gradient(180deg,rgb(97, 97, 97) 0%,rgb(93, 93, 93) 100%);
  color: white;
  padding: 40px 30px;
  box-shadow: 4px 0 20px rgba(0,0,0,0.1);
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar ul li {
  margin: 15px 0;
}
.sidebar ul li a {
  color: #ecf0f1;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 20px;
}
.sidebar ul li a:hover {
  color: white;
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* .content taking the rest of the width */
.content {
  flex: 1;  /* fill the remaining horizontal space */
  padding: 20px;
  background-color: #f9f9f9;
  /* If you want vertical scrolling on the entire page,
     just let body or the container scroll. No min-height forcing. */
}

/* .dashboard-grid can fill content area; remove forced height so it can grow */
.dashboard-grid {
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
  height: 100%;
  /* remove forced height so it grows with content */
}

/* Rectangles (widgets) */
.rectangle {
  background: #fff;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.rectangle:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
  border-color: rgba(10, 10, 10, 0.2);
}
.rectangle.hidden {
  display: none;
}
.rectangle.maximized {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: 0;
  border-radius: 0;
  z-index: 999;
  box-shadow: none;
}
.rectangle-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color:rgb(3, 3, 3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}
.rectangle-title i {
  color:rgb(0, 0, 0);
  font-size: 22px;
  transition: transform 0.3s ease;
  cursor: pointer;
}
.rectangle-content {
  flex: 1;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Profile circle expansions */
.profile-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: width 0.3s, height 0.3s;
}
.profile-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-circle.expanded {
  width: 100px;
  height: 100px;
}

/* .user-name: styling the username text */
.user-name {
  font-weight: 500;
  margin-left: 10px;
}

/* -------------- END OF style.css CONTENT (UPDATED) -------------- */
        `
        }}
      />

      {/* Header */}
      <div className="blue-line">
        <div className="logo-container">
          <img src="/earth.png" alt="Logo" />
          <div className="title">E-Land Records</div>
        </div>
        <div className="header-title">Land Record Management</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className={`profile-circle ${profileExpanded ? 'expanded' : ''}`}
            onClick={() => setProfileExpanded(!profileExpanded)}
          >
            {user && user.photo ? (
              <img src={`/uploads/profilephotos/${user.photo}`} alt="Profile" />
            ) : (
              <img src="/uploads/profilephotos/user.png" alt="Profile" />
            )}
          </div>
          <div className="user-name">
            {user ? user.firstname : 'User'}
          </div>
        </div>
      </div>

      {/* Dashboard container: display flex => sidebar + content */}
      <div className="dashboard-container">
        {/* Sidebar (NOT fixed) */}
        <div className="sidebar">
          <ul>
            <li>
              <a onClick={() => navigate('/userhome')}>
                <i className="fas fa-globe"></i> E-Land
              </a>
            </li>
            <li>
              <a onClick={() => {
                localStorage.clear();
                navigate('/');
              }}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </a>
            </li>
          </ul>
        </div>

        {/* Main content area */}
        <div className="content">
          <div className="dashboard-grid">
            {/* eFile widget */}
            <div className={getWidgetClass('efile')}>
              <div className="rectangle-title">
                <span><i className="fas fa-file-alt"></i> eFile</span>
                <i
                  className="fas fa-expand"
                  onClick={() => handleMaximize('efile')}
                  title="Maximize / Restore"
                />
              </div>
              <div className="rectangle-content">
                No record found
              </div>
            </div>

            {/* Notes widget */}
            <div className={getWidgetClass('notes')}>
              <div className="rectangle-title">
                <span><i className="fas fa-sticky-note"></i> Notes</span>
                <i
                  className="fas fa-expand"
                  onClick={() => handleMaximize('notes')}
                  title="Maximize / Restore"
                />
              </div>
              <div className="rectangle-content">
                No record found
              </div>
            </div>

            {/* DB Link widget */}
            <div className={getWidgetClass('dbLink')}>
              <div className="rectangle-title">
                <span><i className="fas fa-database"></i> DB Link</span>
                <i
                  className="fas fa-expand"
                  onClick={() => handleMaximize('dbLink')}
                  title="Maximize / Restore"
                />
              </div>
              <div className="rectangle-content">
                No record found
              </div>
            </div>

            {/* Notice Board widget */}
            <div className={getWidgetClass('noticeBoard')}>
              <div className="rectangle-title">
                <span><i className="fas fa-bullhorn"></i> Notice Board</span>
                <i
                  className="fas fa-expand"
                  onClick={() => handleMaximize('noticeBoard')}
                  title="Maximize / Restore"
                />
              </div>
              <div className="rectangle-content">
                No record found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
