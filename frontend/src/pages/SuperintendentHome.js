import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuperintendentHome() {
  // Page switching and sorting states
  const [activePage, setActivePage] = useState("dashboard");

  // Chat states
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedChatApp, setSelectedChatApp] = useState(null);
  const [chatRole, setChatRole] = useState("Clerk");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageInput, setChatMessageInput] = useState("");

  // New: Chat Applications state (applications with chat records where clerk is involved)
  const [chatApplications, setChatApplications] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);

  // Inbox: Pending Applications
  const [pendingApplications, setPendingApplications] = useState([]);
  
  // official context
  const [official, setOfficial] = useState(null);
  useEffect(() => {
    const storedOfficial = localStorage.getItem("official");
    if (storedOfficial) setOfficial(JSON.parse(storedOfficial));
  }, []);



  // Fetch pending applications
  const fetchPendingApplications = async () => {
    if (!official?.officialid) return;
    try {
      const response = await fetch(`/api/applicationdetails/sent`);
      const data = await response.json();
      if (response.ok) {
        const pending = (data.applications || []).filter(app => app.status === "Sent to Super Intendent");
        setPendingApplications(pending);
      } else {
        alert(data.message || "Failed to fetch pending applications");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch chat applications (applications in chats where clerk is involved)
  const fetchChatApplications = async () => {
    if (!official?.officialid) return;
    try {
      // Assuming an endpoint exists that returns distinct chat conversations for clerk
      const response = await fetch(`/api/chats/superintendent`);
      const data = await response.json();
      if (response.ok) {
        setChatApplications(data.chats || []);
      } else {
        alert(data.message || "Failed to fetch chat applications");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activePage === 'inbox' && official) {
      fetchPendingApplications();
      fetchChatApplications();
    }
  }, [activePage, official]);

  // Fetch sent applications
  const [sentApplications, setSentApplications] = useState([]);
  const fetchSentApplications = async () => {
    if (!official?.officialid) return;
    try {
      const response = await fetch(`/api/applicationdetails/sent`);
      const data = await response.json();
      if (response.ok) setSentApplications((data.applications || []).filter(app => (app.status !== "Sent to ITDA" && app.status !=="created" && app.status!="Pending with User" && app.status != "Sent to Super Intendent")));
      else alert(data.message || "Failed to fetch sent applications");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (activePage === 'sent') fetchSentApplications();
  }, [activePage, official]);

  useEffect(() => {
    let interval;
    if (chatModalOpen && selectedChatApp) {
      interval = setInterval(() => {
        loadChatHistory(chatRole, selectedChatApp);
      }, 2000); // refresh every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chatModalOpen, selectedChatApp, chatRole]);

  // "Take Action" modal states (unchanged)
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [denialReason, setDenialReason] = useState("");

  const openActionModal = (app, e) => {
    if (e) e.stopPropagation();
    setSelectedApp(app);
    setDenialReason("");
    setActionModalOpen(true);
  };

  const handleModalAction = async (actionType) => {
    let newStatus = "";
    let reason = "";
    if (actionType === "proceed") {
      newStatus = "Sent to Project Officer 1";
    } else if (actionType === "deny") {
      if (!denialReason.trim()) {
        alert("Please provide a reason for denial.");
        return;
      }
      newStatus = "Rejected by Super Intendent";
      reason = denialReason;
    }
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      if (reason) {
        formData.append("message", reason);
      }
      const response = await fetch(`/api/applicationdetails/updateApplication/${selectedApp._id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        alert("Application updated successfully!");
        setActionModalOpen(false);
        setSelectedApp(null);
        fetchPendingApplications();
        fetchSentApplications();
      } else {
        alert(data.message || "Failed to update application.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating application.");
    }
  };

  // Open chat modal with the selected application
  const openChatWindow = (app) => {
    setSelectedChatApp(app);
    setChatModalOpen(true);
    loadChatHistory(chatRole, app);
  };

  // Load chat history from the backend
  const loadChatHistory = async (role, app = selectedChatApp) => {
    if (!app) return;
    try {
      const response = await fetch(`/api/chats/si?appId=${app?._id || ""}&receiptid=${app?.receiptid || ""}&role=${role}`);
      const data = await response.json();
      if (response.ok) {
        setChatMessages(data.chats || []);
      } else {
        alert(data.message || "Failed to load chat history.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send a new chat message
  const sendChatMessage = async () => {
    if (!chatMessageInput.trim() || !selectedChatApp) return;
    try {
      const payload = {
        appId: selectedChatApp._id,
        receiptid: selectedChatApp.receiptid,
        from: "superintendent",
        to: chatRole.toLowerCase().replace(/\s/g, "_"),
        message: chatMessageInput,
      };
      const response = await fetch(`/api/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setChatMessageInput("");
        loadChatHistory(chatRole);
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/superintendentdashboard');
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Global Styles */
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', sans-serif; font-size:18px; }
        body { background-color: linear-gradient(145deg, #cfd9df, #e2ebf0); color:#333; min-height:100vh; overflow-x:hidden; line-height:1.6; }
        .blue-line { background: linear-gradient(to right, #434343, #000000); color:white; padding:25px 40px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 4px 20px rgba(0,0,0,0.15); height:80px; }
        .logo-container { display:flex; gap:20px; align-items:center; }
        .logo-container img { width:65px; height:65px; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
        .title { font-size:26px; font-weight:600; letter-spacing:0.5px; background:linear-gradient(to right, #ffffff, #e0e0e0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-shadow:2px 2px 4px rgba(0,0,0,0.1); }
        .header-title { font-size:44px; font-weight:600; text-shadow:2px 2px 4px rgba(0,0,0,0.15); color:white; }
        .nav-bar { background-color:#333; color:white; display:flex; border-bottom:1px solid #444; }
        .nav-section { display:flex; align-items:center; }
        .nav-item { padding:8px 15px; cursor:pointer; font-size:14px; border-right:1px solid #444; }
        .nav-item.active { background-color:#0056b3; }
        .nav-item.header-item { font-weight:bold; cursor:default; background-color:#444; }
        .main-container { display:flex; min-height:calc(100vh - 80px); }
        .sidebar { width:80px; background: linear-gradient(to bottom, #868f96, #596164); color:white; display:flex; flex-direction:column; align-items:center; padding-top:20px; }
        .sidebar-icon { color:white; font-size:20px; margin-bottom:25px; cursor:pointer; }
        .content-area { flex:1; background:#f9f9f9; position:relative; padding:20px; }
        /* Table Styles */
        .records-table, .records-table2 {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background-color: #fff;
        }
        .records-table th, .records-table td, .records-table2 th, .records-table2 td {
          border: 1px solid #ddd;
          padding: 12px;
          font-size: 14px;
          text-align: left;
        }
        .records-table th {
          background-color: rgb(61, 57, 109);
          color: white;
          cursor: pointer;
        }
        .records-table2 th {
          background-color: rgb(53, 80, 3);
          color: white;
          cursor: pointer;
        }
        
        .records-table tbody tr:nth-child(even), .records-table2 tbody tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .records-table tbody tr:hover, .records-table2 tbody tr:hover {
          background-color: #e6f7ff;
          cursor: pointer;
        }
        /* Button Styles */
        .button { 
          background: linear-gradient(to right, #434343, #000000);
          border: none; 
          border-radius: 10px; 
          padding: 12px 25px; 
          color: #fff; 
          font-size: 16px; 
          cursor: pointer; 
          transition: all 0.3s ease; 
          display: inline-flex; 
          align-items: center; 
          gap: 6px;
        }
        .button:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 8px 25px rgba(33,147,176,0.4); 
         background: white; color: #000000; border: 1px solid #000000;}
        .button-takeaction { 
          background: linear-gradient(to right, #434343, #000000); 
        }

        .button-proceed {
        background: linear-gradient(to right, #434343, #000000);
        }

        .button-denial{
        background: linear-gradient(to right, #434343, #000000);
        }
        .button-yellow { background: linear-gradient(to right, #434343, #000000); color: #000; }
        .button-red { background: linear-gradient(to right, #434343, #000000); color: #000; }
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal-container {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          width: 500px;
          max-width: 90%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          text-align: center;
        }
        .modal-header {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
        }
        .modal-body {
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
        }
        .modal-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 20px;
        }
        .modal-input {
          width: 100%;
          padding: 12px;
          margin: 15px 0;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
        }

        .button-send {
  background: linear-gradient(to right, #434343, #000000);
  border: none;
  border-radius: 10px;
  padding: 12px 25px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.button-send:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(40,167,69,0.4);
 background: white; color: #000000; border: 1px solid #000000;}

.button-close {
  background: linear-gradient(to right, #434343, #000000);
  border: none;
  border-radius: 90%;
  width: 40px;
  height: 40px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  top: 25px;
  right: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button-close:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(220,53,69,0.4);
 background: white; color: #000000; border: 1px solid #000000;}

      ` }} />

      {/* Header */}
      <div className="blue-line">
        <div className="logo-container">
          <img src="/earth.png" alt="Logo" />
          <div className="title"><i className="fas fa-globe"></i> E-Land Records</div>
        </div>
        <div className="header-title"> Super Intendent Dashboard</div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={{cursor:'pointer'}}></i>
        </div>
      </div>

      {/* Nav Bar */}
      <div className="nav-bar">
        <div className="nav-section">
          <div className="nav-item header-item"><i className="fas fa-home"></i> HOME</div>
          <div className="nav-item" onClick={handleDashboard}> Dashboard</div>
          <div className={`nav-item ${activePage==="dashboard"?"active":""}`} onClick={()=>setActivePage("dashboard")}> View</div>
        </div>
        <div className="nav-section">
          <div className="nav-item header-item"><i className="fas fa-file-alt"></i> APPLICATIONS</div>
          <div className={`nav-item ${activePage==="inbox"?"active":""}`} onClick={()=>setActivePage("inbox")}> Inbox</div>
          <div className={`nav-item ${activePage==="sent"?"active":""}`} onClick={()=>setActivePage("sent")}> Sent</div>
        </div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        <div className="sidebar">
          <div className="sidebar-icon" onClick={()=>setActivePage("dashboard")}><i className="fas fa-eye"></i></div>
          <div className="sidebar-icon" onClick={handleDashboard}><i className="fas fa-tachometer-alt"></i></div>
          <div className="sidebar-icon" onClick={()=>setActivePage("inbox")}><i className="fas fa-inbox"></i></div>
          <div className="sidebar-icon" onClick={()=>setActivePage("sent")}><i className="fas fa-paper-plane"></i></div>
          <div className="sidebar-icon" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i></div>
        </div>

        <div className="content-area">
          {/* Dashboard */}
          {activePage==="dashboard" && (
            <div>
              <h2><i className="fas fa-user"></i> Login View</h2>
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{
                  width: '20%',
                  padding: '20px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <h3><i className="fas fa-info-circle"></i> Login Details</h3>
                  <p>
                    Name: {localStorage.getItem("official")
                      ? JSON.parse(localStorage.getItem("official")).firstname + ' ' + JSON.parse(localStorage.getItem("official")).lastname
                      : "Unknown"}
                  </p>
                  <p><i className="fas fa-user-tag"></i> Role: Super Intendent</p>
                  <p><i className="fas fa-network-wired"></i> IP: 14.139.85.200</p>
                </div>
                <div style={{
                  width: '40%',
                  padding: '20px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <h3><i className="fas fa-bell"></i> Alerts &amp; Notifications</h3>
                  <p>No new notifications.</p>
                </div>
              </div>
            </div>
          )}

          {/* Inbox */}
          {activePage==="inbox" && (
            <div>
              {/* Pending Applications Section */}
              <h2><i className="fas fa-inbox"></i> Pending Applications</h2>
              {pendingApplications.length === 0 ? (
                <p><i className="fas fa-exclamation-circle"></i> No pending applications found.</p>
              ) : (
                <table className="records-table" style={{ marginTop:'20px' }}>
                  <thead>
                    <tr>
                      <th><i className="fas fa-hashtag"></i> Comp No</th>
                      <th><i className="fas fa-receipt"></i> Receipt No</th>
                      <th><i className="fas fa-list-ol"></i> Survey No</th>
                      <th><i className="fas fa-user"></i> Owner Name</th>
                      <th><i className="fas fa-map-marker-alt"></i> Location</th>
                      <th><i className="fas fa-info-circle"></i> Status</th>
                      <th><i className="fas fa-file"></i> Documents</th>
                      <th><i className="fas fa-file-pdf"></i> Letter</th>
                      <th><i className="fas fa-tools"></i> Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApplications.map((app, idx) => (
                      <tr key={idx} onClick={() => openChatWindow(app)}>
                        <td>{app.compno}</td>
                        <td>{app.receiptid}</td>
                        <td>{app.surveyNumber}</td>
                        <td>{app.ownerName}</td>
                        <td>{`${app.area}, ${app.address}, ${app.state}, ${app.city}, ${app.pincode}`}</td>
                        <td>{app.status}</td>
                        <td>
                          {app.documents && app.documents[0] ? (
                            <a href={`http://localhost:5000/uploads/useruploads/${app.documents[0]}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                              <i className="fas fa-eye"></i>
                            </a>
                          ) : (
                            <i className="fas fa-file"></i>
                          )}
                        </td>
                        <td>
                          {app.documents && app.documents[1] ? (
                            <a href={`http://localhost:5000/uploads/generatedletters/${app.documents[1]}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                              <i className="fas fa-file-pdf" style={{ color:'#d9534f' }}></i>
                            </a>
                          ) : (
                            <i className="fas fa-file"></i>
                          )}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <button className="button button-takeaction" onClick={(e) => openActionModal(app, e)}>
                            <i className="fas fa-hand-pointer"></i> Take Action
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Chats Section */}
              <h2 style={{ marginTop: '40px' }}><i className="fas fa-comments"></i> Chats</h2>
              {chatApplications.length === 0 ? (
                <p><i className="fas fa-exclamation-circle"></i> No chat records found.</p>
              ) : (
                <table className="records-table2" style={{ marginTop:'20px' }}>
                  <thead>
                    <tr>
                    <th><i className="fas fa-hashtag"></i> Comp No</th>
                      <th><i className="fas fa-receipt"></i> Receipt No</th>
                      <th><i className="fas fa-list-ol"></i> Survey No</th>
                      <th><i className="fas fa-user"></i> Owner Name</th>
                      <th><i className="fas fa-map-marker-alt"></i> Location</th>
                      <th><i className="fas fa-info-circle"></i> Status</th>
                      <th><i className="fas fa-file"></i> Documents</th>
                      <th><i className="fas fa-file-pdf"></i> Letter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chatApplications.map((app, idx) => (
                      <tr key={idx} onClick={() => openChatWindow(app)}>
                        <td>{app.compno}</td>
                        <td>{app.receiptid}</td>
                        <td>{app.surveyNumber}</td>
                        <td>{app.ownerName}</td>
                        <td>{`${app.area}, ${app.address}, ${app.state}, ${app.city}, ${app.pincode}`}</td>
                        <td>{app.status}</td>
                        <td>
                          {app.documents && app.documents[0] ? (
                            <a href={`http://localhost:5000/uploads/useruploads/${app.documents[0]}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                              <i className="fas fa-eye"></i>
                            </a>
                          ) : (
                            <i className="fas fa-file"></i>
                          )}
                        </td>
                        <td>
                          {app.documents && app.documents[1] ? (
                            <a href={`http://localhost:5000/uploads/generatedletters/${app.documents[1]}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                              <i className="fas fa-file-pdf" style={{ color:'#d9534f' }}></i>
                            </a>
                          ) : (
                            <i className="fas fa-file"></i>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Sent Applications */}
          {activePage === "sent" && (
            <div>
              <h2><i className="fas fa-list"></i> Sent Applications</h2>
              {sentApplications.length === 0 ? (
                <p><i className="fas fa-exclamation-circle"></i> No sent applications found.</p>
              ) : (
                <table className="records-table" style={{ marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th><i className="fas fa-receipt"></i> Receipt ID</th>
                      <th><i className="fas fa-hashtag"></i> Comp No</th>
                      <th><i className="fas fa-user"></i> Owner Name</th>
                      <th><i className="fas fa-list-ol"></i> Survey #</th>
                      <th><i className="fas fa-map-marker-alt"></i> Location</th>
                      <th><i className="fas fa-info-circle"></i> Status</th>
                      <th><i className="fas fa-file"></i> User Uploads</th>
                      <th><i className="fas fa-file-pdf"></i> Generated Letter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sentApplications.map((app, idx) => (
                      <tr key={idx}>
                        <td>{app.receiptid}</td>
                        <td>{app.compno}</td>
                        <td>{app.ownerName}</td>
                        <td>{app.surveyNumber}</td>
                        <td>{app.address}, {app.city}, {app.pincode}</td>
                        <td>{app.status}</td>
                        <td>
                          {app.documents && app.documents[0] ? (
                            <a href={`http://localhost:5000/uploads/useruploads/${app.documents[0]}`} target="_blank" rel="noopener noreferrer">
                              <i className="fas fa-eye"></i>
                            </a>
                          ) : (
                            <i className="fas fa-file"></i>
                          )}
                        </td>
                        <td>
                          {app.documents && app.documents[1] ? (
                            <a href={`http://localhost:5000/uploads/generatedletters/${app.documents[1]}`} target="_blank" rel="noopener noreferrer">
                              <i className="fas fa-file-pdf" style={{ color:'#d9534f' }}></i>
                            </a>
                          ) : (
                            <i className="fas fa-file"></i>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      

      {/* "Take Action" Modal */}
      {actionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header"><i className="fas fa-hand-pointer"></i> Take Action</div>
            <div className="modal-body">
              <p>Please choose an action for this application:</p>
              <div className="modal-actions">
                <button className="button button-proceed" onClick={() => handleModalAction("proceed")}>
                  <i className="fas fa-check"></i> Approve
                </button>
                <button className="button button-yellow" onClick={() => setActionModalOpen(false)}>
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
              <div style={{ marginTop: "20px" }}>
                <p>If denying, please provide a reason:</p>
                <textarea
                  className="modal-input"
                  placeholder="Enter rejection reason..."
                  value={denialReason}
                  onChange={(e) => setDenialReason(e.target.value)}
                />
                <button className="button button-denial" onClick={() => handleModalAction("deny")}>
                  <i className="fas fa-ban"></i> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '800px', position: 'relative' }}>
  {/* Red close button with only icon at top right */}
  <button className="button-close" onClick={() => setChatModalOpen(false)}>
    <i className="fas fa-times"></i>
  </button>
  <div className="modal-header">
    <i className="fas fa-comments"></i> Chat with {chatRole} (Receipt: {selectedChatApp?.receiptid})
  </div>
  <div className="modal-body" style={{ height: '300px', overflowY: 'auto', textAlign: 'left' }}>
    {chatMessages.length === 0 ? (
      <p><i className="fas fa-info-circle"></i> No messages yet.</p>
    ) : (
      chatMessages.map((msg, idx) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <strong>{msg.from === "superintendent" ? <i className="fas fa-user"></i> : <i className="fas fa-user-tie"></i>} {msg.from === "superintendent" ? "You" : chatRole}:</strong> {msg.message}
        </div>
      ))
    )}
  </div>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <input
      type="text"
      placeholder="Type your message..."
      value={chatMessageInput}
      onChange={(e) => setChatMessageInput(e.target.value)}
      style={{ flex: 1, padding: '10px' }}
    />
    <button className="button button-send" onClick={sendChatMessage}>
      <i className="fas fa-paper-plane"></i> Send
    </button>
  </div>
  <div style={{ marginTop: '10px' }}>
    <label htmlFor="role-select"><i className="fas fa-exchange-alt"></i> Chat with: </label>
    <select
      id="role-select"
      value={chatRole}
      onChange={(e) => {
        setChatRole(e.target.value);
        loadChatHistory(e.target.value);
      }}
    >
      <option>Clerk</option>
      <option>Project Officer</option>
      <option>Surveyor</option>
      <option>MRO</option>
      <option>VRO</option>
      <option>Revenue Inspector</option>
      <option>Revenue Dept Officer</option>
      <option>Joint Collector</option>
      <option>District Collector</option>
      <option>Ministry Welfare</option>
    </select>
  </div>
</div>

        </div>
      )}
    </div>
  );
}

export default SuperintendentHome;
