import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserHome() {
  // Page switching
  const [activePage, setActivePage] = useState("dashboard");

  // =================== 1) Inbox data, sorting, and chat ===================
  // (These remain for other sections; they are not used in the pending inbox)
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Chat (unchanged)
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedInboxItem, setSelectedInboxItem] = useState(null);
  const handleRowClick = (item) => {
    setSelectedInboxItem(item);
    setChatOpen(true);
  };
  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedInboxItem(null);
  };

  // =================== 2) File Upload & Land Registration Form ===================
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setDocumentUploaded(true);
    }
  };

  // Land Registration form fields for create page
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [date, setDate] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [surveyNumber, setSurveyNumber] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [cityDistrict, setCityDistrict] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [applications, setApplications] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // =================== 3) Inbox Section: Pending Applications & Edit Modal ===================
  const [pendingApplications, setPendingApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAadhar, setEditAadhar] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editOwnerName, setEditOwnerName] = useState("");
  const [editSurveyNumber, setEditSurveyNumber] = useState("");
  const [editArea, setEditArea] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editState, setEditState] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPinCode, setEditPinCode] = useState("");
  // New state for file reupload in edit modal
  const [editUploadedFile, setEditUploadedFile] = useState(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    if (editingApplication) {
      setEditFullName(editingApplication.fullName);
      setEditEmail(editingApplication.email);
      setEditPhone(editingApplication.phone);
      setEditAadhar(editingApplication.aadharnumber);
      setEditDate(editingApplication.date ? new Date(editingApplication.date).toISOString().split('T')[0] : "");
      setEditOwnerName(editingApplication.ownerName);
      setEditSurveyNumber(editingApplication.surveyNumber);
      setEditArea(editingApplication.area);
      setEditAddress(editingApplication.address);
      setEditState(editingApplication.state);
      setEditCity(editingApplication.city);
      setEditPinCode(editingApplication.pincode);
      setEditUploadedFile(null);
    }
  }, [editingApplication]);

  // =================== 4) User Context ===================
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Remove file in create form (unchanged)
  const handleRemove = () => {
    setUploadedFile(null);
    setDocumentUploaded(false);
  };

  // Validate form for create
  const validateForm = () => {
    if (
      !fullName || !email || !phone || !aadhar || !date ||
      !ownerName || !surveyNumber || !area || !address ||
      !stateValue || !cityDistrict || !pinCode
    ) return false;
    return true;
  };

  // Fetch applications for create section (unchanged)
  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applicationdetails/created');
      const data = await response.json();
      if (response.ok) setApplications(data.applications || []);
      else alert(data.message || "Failed to fetch applications");
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch pending applications for Inbox (status "Pending with User")
  const fetchPendingApplications = async () => {
    if (!user?.username) return;
    try {
      const response = await fetch(`/api/applicationdetails/sent?username=${user.username}`);
      const data = await response.json();
      if (response.ok) {
        const pending = (data.applications || []).filter(app => app.status === "Pending with User");
        setPendingApplications(pending);
      } else {
        alert(data.message || "Failed to fetch pending applications");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activePage === 'inbox' && user) {
      fetchPendingApplications();
    }
  }, [activePage, user]);

  // =================== 5) Create New Application Handler (unchanged) ===================
  const handleGenerate = async () => {
    if (!validateForm()) {
      alert("Please fill all details before generating. (Document optional?)");
      return;
    }
    if (!user?.username) {
      alert("No logged-in user available!");
      return;
    }
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("aadhar", aadhar);
    formData.append("date", date);
    formData.append("ownerName", ownerName);
    formData.append("surveyNumber", surveyNumber);
    formData.append("area", area);
    formData.append("address", address);
    formData.append("stateValue", stateValue);
    formData.append("cityDistrict", cityDistrict);
    formData.append("pinCode", pinCode);
    if (uploadedFile) formData.append("document", uploadedFile);
    try {
      const response = await fetch('/api/applicationdetails/generate', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        alert("Application generated successfully!");
        fetchApplications();
        // Reset the form fields
        setFullName("");
        setEmail("");
        setPhone("");
        setAadhar("");
        setDate("");
        setOwnerName("");
        setSurveyNumber("");
        setArea("");
        setAddress("");
        setStateValue("");
        setCityDistrict("");
        setPinCode("");
        setUploadedFile(null);
        setDocumentUploaded(false);
      } else {
        alert(data.message || "Failed to generate");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating application");
    }
  };
  

  // =================== 6) Update (Edit) Application Handler (with file reupload) ===================
  const handleUpdateApplication = async () => {
    if (
      !editFullName || !editEmail || !editPhone || !editAadhar || !editDate ||
      !editOwnerName || !editSurveyNumber || !editArea || !editAddress ||
      !editState || !editCity || !editPinCode
    ) {
      alert("Please fill all details before updating.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("fullName", editFullName);
      formData.append("email", editEmail);
      formData.append("phone", editPhone);
      formData.append("aadharnumber", editAadhar);
      formData.append("date", editDate);
      formData.append("ownerName", editOwnerName);
      formData.append("surveyNumber", editSurveyNumber);
      formData.append("area", editArea);
      formData.append("address", editAddress);
      formData.append("state", editState);
      formData.append("city", editCity);
      formData.append("pincode", editPinCode);
      // Force status to "Sent to ITDA"
      formData.append("status", "Sent to ITDA");
      formData.append("currentlywith", "Clerk");
      if (editUploadedFile) {
        formData.append("document", editUploadedFile);
      }
      const response = await fetch(`/api/applicationdetails/updateApplicationAll/${editingApplication._id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        alert("Application updated successfully!");
        setEditingApplication(null);
        fetchPendingApplications();
      } else {
        alert(data.message || "Failed to update application.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating application.");
    }
  };

  // =================== 7) Send to ITDA Handler (unchanged) ===================
  const handleSendToITDA = async () => {
    if (selectedRows.length === 0) {
      alert("No application selected.");
      return;
    }
    try {
      const selectedApps = selectedRows.map(idx => applications[idx]);
      const response = await fetch('/api/applicationdetails/updateStatus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationIds: selectedApps.map(app => app._id),
          newStatus: "Sent to ITDA"
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Applications sent to ITDA!");
        setSelectedRows([]);
        fetchApplications();
      } else {
        alert(data.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending to ITDA");
    }
  };

  const handleSelectRow = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  // =================== 8) Sent Applications (unchanged) ===================
  const [sentApplications, setSentApplications] = useState([]);
  const fetchSentApplications = async () => {
    if (!user?.username) return;
    try {
      const response = await fetch(`/api/applicationdetails/sent?username=${user.username}`);
      const data = await response.json();
      if (response.ok) setSentApplications(data.applications || []);
      else alert(data.message || "Failed to fetch sent apps");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (activePage === 'sent') fetchSentApplications();
  }, [activePage, user]);

  // =================== 9) New: Issue -> Sent (sent2) ===================
  // New state for sent success applications (status "success")
  const [sentSuccessApplications, setSentSuccessApplications] = useState([]);
  const fetchSentSuccessApplications = async () => {
    if (!user?.username) return;
    try {
      const response = await fetch(`/api/applicationdetails/sent?username=${user.username}`);
      const data = await response.json();
      if (response.ok) {
        const successApps = (data.applications || []).filter(app => app.status === "Success");
        setSentSuccessApplications(successApps);
      } else {
        alert(data.message || "Failed to fetch sent success applications");
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (activePage === 'sent2' && user) {
      fetchSentSuccessApplications();
    }
  }, [activePage, user]);

  // =================== 10) Navigation and Logout (unchanged) ===================
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
/* Global Reset & Typography */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
  font-size: 18px;
}

html, body {
  background: linear-gradient(145deg, #cfd9df, #e2ebf0);
  color: #333;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto; /* ✅ Ensures vertical scroll works */
  line-height: 1.6;
}

/* Header Top Bar */
.blue-line {
  background: linear-gradient(to right, #434343, #000000);
  color: white;
  padding: 25px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  height: 80px;
}

/* Logo and Title */
.logo-container {
  display: flex;
  gap: 20px;
  align-items: center;
}

.logo-container img {
  width: 65px;
  height: 65px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
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
  font-size: 44px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  color: white;
}

/* Navigation Bar */
.nav-bar {
  background-color: #333;
  color: white;
  display: flex;
  border-bottom: 1px solid #444;
  flex-wrap: wrap;
}

.nav-section {
  display: flex;
  align-items: center;
}

.nav-item {
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  border-right: 1px solid #444;
  transition: all 0.3s ease;
}

.nav-item.active {
  background-color: #0056b3;
  color: white;
}

.nav-item.header-item {
  font-weight: bold;
  cursor: default;
  background-color: #444;
}

/* Main Layout */
.main-container {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: stretch;
}

/* Sidebar Navigation */
.sidebar {
  width: 80px;
  background: linear-gradient(to bottom, #868f96, #596164);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  min-height: 100%;
}

.sidebar-icon {
  color: white;
  font-size: 20px;
  margin-bottom: 25px;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
}

.sidebar-icon:hover {
  transform: scale(1.1);
  color: #ddd;
}

/* Main Content Area */
.content-area {
  flex: 1;
  background: #f9f9f9;
  position: relative;
  padding: 20px;
}

/* Table Styles */
.records-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.records-table th,
.records-table td {
  border: 1px solid #ddd;
  padding: 8px;
  font-size: 14px;
  text-align: left;
}

.records-table th {
  background-color: #f0f0f0;
  cursor: pointer;
}

.records-table tbody tr:hover {
  background-color: #fafafa;
}

/* Button Styles */
.button {
  background: linear-gradient(to right, #434343, #000000);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.button:hover {
  background: white;
  color: black;
  border: 1px solid #000;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 67, 67, 0.3);
}

/* File Upload Buttons */
.file-upload-wrapper {
  position: relative;
  display: inline-block;
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-upload-label {
  display: inline-block;
  cursor: pointer;
  background: linear-gradient(to right, #434343, #000000);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  text-align: center;
}

.file-upload-label:hover {
  transform: translateY(-2px);
  background: white;
  color: black;
  border: 1px solid #000;
  box-shadow: 0 4px 12px rgba(67, 67, 67, 0.4);
}

 ` }} />

      {/* Header */}
      <div className="blue-line">
        <div className="logo-container">
          <img src="/earth.png" alt="Logo" />
          <div className="title">E-Land Records</div>
        </div>
        <div className="header-title">Land Record Management</div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ cursor:'pointer' }}><i className="fas fa-cog"></i></div>
        </div>
      </div>

      {/* Nav Bar */}
      <div className="nav-bar">
        <div className="nav-section">
          <div className="nav-item header-item">DASHBOARD</div>
          <div className={`nav-item ${activePage==="dashboard"?"active":""}`} onClick={()=>setActivePage("dashboard")}>View</div>
        </div>
        <div className="nav-section">
          <div className="nav-item header-item">RECEIPT</div>
          <div className={`nav-item ${activePage==="landRegistration"?"active":""}`} onClick={()=>setActivePage("landRegistration")}>Create</div>
          <div className={`nav-item ${activePage==="inbox"?"active":""}`} onClick={()=>setActivePage("inbox")}>Inbox</div>
          <div className={`nav-item ${activePage==="sent"?"active":""}`} onClick={()=>setActivePage("sent")}>Sent</div>
        </div>
        <div className="nav-section">
          <div className="nav-item header-item">ISSUE</div>
          {/* Changed the onClick for Issue -> Sent to set activePage to "sent2" */}
          <div className={`nav-item ${activePage==="sent2"?"active":""}`} onClick={()=>setActivePage("sent2")}>Sent</div>
          <div className="nav-item" onClick={()=>alert("Issue -> Returned")}>Returned</div>
        </div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        <div className="sidebar">
          <div className="sidebar-icon" onClick={()=>setActivePage("dashboard")}><i className="fas fa-home"></i></div>
          <div className="sidebar-icon" onClick={()=>setActivePage("landRegistration")}><i className="fas fa-file-alt"></i></div>
          <div className="sidebar-icon" onClick={()=>setActivePage("inbox")}><i className="fas fa-inbox"></i></div>
          <div className="sidebar-icon" onClick={()=>setActivePage("sent")}><i className="fas fa-paper-plane"></i></div>
          <div className="sidebar-icon" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i></div>
        </div>

        <div className="content-area">
          {/* Dashboard (unchanged) */}
          {activePage==="dashboard" && (
            <div style={{ padding:'20px' }}>
              <h2 style={{ marginBottom:'10px' }}>Dashboard View</h2>
              <div className="dashboard-sections">
                <div className="dashboard-panel">
                  <h3>File Details</h3>
                  <p>No file details available.</p>
                </div>
                <div className="dashboard-panel">
                  <h3>User &amp; Login Details</h3>
                  <p>Name: {user ? user.firstname : "Unknown"}</p>
                  <p>Role: Basic User</p>
                  <p>IP Address: 14.139.85.200</p>
                </div>
                <div className="dashboard-panel">
                  <h3>Alerts &amp; Notifications</h3>
                  <p>No new notifications.</p>
                </div>
              </div>
            </div>
          )}

          {/* Inbox: Pending Applications */}
          {activePage==="inbox" && (
            <div style={{ padding:'20px' }}>
              <h2><i className="fas fa-inbox"></i> Pending Applications</h2>
              {pendingApplications.length === 0 ? (
                <p>No pending applications found.</p>
              ) : (
                <table className="records-table" style={{ marginTop:'20px' }}>
                  <thead>
                    <tr>
                      <th>Comp No</th>
                      <th>Receipt No</th>
                      <th>Survey No</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Messages</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApplications.map((app, idx) => (
                      <tr key={idx}>
                        <td>{app.compno}</td>
                        <td>{app.receiptid}</td>
                        <td>{app.surveyNumber}</td>
                        <td>{`${app.area}, ${app.address}, ${app.state}, ${app.city}, ${app.pincode}`}</td>
                        <td>{app.status}</td>
                        <td>{app.messages && app.messages.length > 0 ? app.messages.join(', ') : 'No messages'}</td>
                        <td>
                          <button className="button" onClick={() => setEditingApplication(app)}>
                            <i className="fas fa-edit"></i> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Land Registration (Create) remains unchanged */}
          {activePage==="landRegistration" && (
            <div style={{ padding:'20px' }}>
              <h2 style={{ marginBottom:'10px' }}>
                <i className="fas fa-map-marked-alt"></i> Land Registration
              </h2>
              <div style={{ display:'flex', gap:'20px', background:'#fff', border:'1px solid #ddd', borderRadius:'6px' }}>
                <div style={{ flex:1, display:'flex', flexDirection:'column', borderRight:'1px solid #ddd' }}>
                  <div style={{ padding:'15px', display:'flex', alignItems:'center', gap:'10px' }}>
                    <button className="button" onClick={handleUploadClick}>
                      <i className="fas fa-upload"></i> Upload Document
                    </button>
                    <button className="button" style={{ background:'#dc3545' }} onClick={handleRemove}>
                      <i className="fas fa-trash"></i> Remove
                    </button>
                    <span style={{ fontSize:'14px', color:'#666' }}>File Only &lt;= 20 MB</span>
                  </div>
                  <div style={{ flex:1, overflow:'auto', display:'flex', alignItems:'center', justifyContent:'center', borderTop:'1px solid #ddd' }}>
                    {!documentUploaded ? (
                      <p style={{ color:'#666' }}>No document uploaded yet</p>
                    ) : uploadedFile ? (
                      uploadedFile.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(uploadedFile)} alt="Document Preview" style={{ maxWidth:'100%', maxHeight:'100%' }}/>
                      ) : uploadedFile.type==="application/pdf" ? (
                        <embed src={URL.createObjectURL(uploadedFile) + "#toolbar=0"} type="application/pdf" style={{ width:'100%', height:'100%' }}/>
                      ) : (
                        <p style={{ color:'#666' }}>No preview for this file type</p>
                      )
                    ) : null}
                  </div>
                </div>
                <div style={{ flex:1, padding:'15px' }}>
                  <div style={{ marginBottom:'15px', display:'flex', alignItems:'center', gap:'10px' }}>
                    <i className="fas fa-user"></i>
                    <strong>Personal Details</strong>
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Full Name</label>
                    <input style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Email</label>
                    <input type="email" style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Phone</label>
                    <input type="tel" style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Aadhar</label>
                    <input style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={aadhar} onChange={e => setAadhar(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Date</label>
                    <input type="date" style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'15px', display:'flex', alignItems:'center', gap:'10px' }}>
                    <i className="fas fa-landmark"></i>
                    <strong>Land Details</strong>
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Owner Name</label>
                    <input style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Survey Number</label>
                    <input style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={surveyNumber} onChange={e => setSurveyNumber(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Area (sq.ft)</label>
                    <input type="number" style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={area} onChange={e => setArea(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Address</label>
                    <textarea style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd', resize:'vertical' }}
                      value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>State</label>
                    <input style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={stateValue} onChange={e => setStateValue(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>City/District</label>
                    <input style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={cityDistrict} onChange={e => setCityDistrict(e.target.value)} />
                  </div>
                  <div style={{ marginBottom:'10px' }}>
                    <label>Pin Code</label>
                    <input style={{ width:'100%', padding:'8px', marginTop:'5px', borderRadius:'4px', border:'1px solid #ddd' }}
                      value={pinCode} onChange={e => setPinCode(e.target.value)} />
                  </div>
                  <button className="button" onClick={handleGenerate}>
                    <i className="fas fa-plus-circle"></i> Generate
                  </button>
                </div>
              </div>
              {applications.length > 0 && (
                <div style={{ marginTop:'20px' }}>
                  <h3><i className="fas fa-list"></i> Generated Applications</h3>
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Receipt ID</th>
                        <th>Comp No</th>
                        <th>Owner Name</th>
                        <th>Survey #</th>
                        <th>Location</th>
                        <th>User Upload</th>
                        <th>Generated Letter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, idx) => (
                        <tr key={idx}>
                          <td>
                            <input type="checkbox" checked={selectedRows.includes(idx)} onChange={() => handleSelectRow(idx)} />
                          </td>
                          <td>{app.receiptid}</td>
                          <td>{app.compno}</td>
                          <td>{app.ownerName}</td>
                          <td>{app.surveyNumber}</td>
                          <td>{app.address}, {app.city}, {app.pincode}</td>
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
                  <button className="button" style={{ marginTop:'10px' }} onClick={handleSendToITDA}>
                    <i className="fas fa-paper-plane"></i> Send to ITDA
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sent Applications (unchanged) */}
          {activePage === "sent" && (
            <div style={{ padding: '20px' }}>
              <h2><i className="fas fa-list"></i> Sent Applications</h2>
              {sentApplications.length === 0 ? (
                <p>No sent applications found.</p>
              ) : (
                <table className="records-table" style={{ marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th>Receipt ID</th>
                      <th>Comp No</th>
                      <th>Owner Name</th>
                      <th>Survey #</th>
                      <th>Location</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th>User Upload</th>
                      <th>Generated Letter</th>
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
                        <td>{new Date(app.createdtimestamp).toLocaleString()}</td>
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

          {/* New: ISSUE -> Sent (sent2) Page: Display applications with status "success" */}
          {activePage === "sent2" && (
            <div style={{ padding: '20px' }}>
              <h2><i className="fas fa-list"></i> Issue Sent (Success)</h2>
              {sentSuccessApplications.length === 0 ? (
                <p>No sent success applications found.</p>
              ) : (
                <table className="records-table" style={{ marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th>Receipt ID</th>
                      <th>Comp No</th>
                      <th>Owner Name</th>
                      <th>Survey #</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>User Upload</th>
                      <th>Generated Letter</th>
                      <th>Surveyor Report</th>
                      <th>Certificate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sentSuccessApplications.map((app, idx) => (
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
                        <td>
                        {app.documents && app.documents[1] ? (
                            <a href={`http://localhost:5000/uploads/surveyreports/${app.documents[2]}`} target="_blank" rel="noopener noreferrer">
                              <i className="fas fa-file-pdf" style={{ color:'#99AA88' }}></i>
                            </a>
                          ) : (
                            <i className="fas fa-file"></i>
                          )}
                        </td>
                        <td>
                        {app.documents && app.documents[1] ? (
                          <a href={`http://localhost:5000/uploads/certificates/${app.documents[3]}`} target="_blank" rel="noopener noreferrer">
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

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      <input
        type="file"
        ref={editFileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setEditUploadedFile(e.target.files[0]);
          }
        }}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />

      {/* Edit Modal */}
      {editingApplication && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '6px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90%',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '15px' }}>
              <i className="fas fa-edit"></i> Edit Application
            </h3>
            <div style={{ marginBottom: '10px' }}>
              <label>Full Name</label>
              <input type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Email</label>
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Phone</label>
              <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Aadhar</label>
              <input type="text" value={editAadhar} onChange={(e) => setEditAadhar(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Date</label>
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Owner Name</label>
              <input type="text" value={editOwnerName} onChange={(e) => setEditOwnerName(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Survey Number</label>
              <input type="text" value={editSurveyNumber} onChange={(e) => setEditSurveyNumber(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Area (sq.ft)</label>
              <input type="number" value={editArea} onChange={(e) => setEditArea(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Address</label>
              <textarea value={editAddress} onChange={(e) => setEditAddress(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>State</label>
              <input type="text" value={editState} onChange={(e) => setEditState(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>City/District</label>
              <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Pin Code</label>
              <input type="text" value={editPinCode} onChange={(e) => setEditPinCode(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Reupload Document (optional)</label>
              <button className="button" onClick={() => editFileInputRef.current && editFileInputRef.current.click()}>
                <i className="fas fa-upload"></i> Choose File
              </button>
              {editUploadedFile && <span style={{ marginLeft: '10px' }}>{editUploadedFile.name}</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="button" onClick={handleUpdateApplication}>
                <i className="fas fa-save"></i> Save
              </button>
              <button className="button" onClick={() => setEditingApplication(null)}>
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file inputs for create and edit */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      <input
        type="file"
        ref={editFileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setEditUploadedFile(e.target.files[0]);
          }
        }}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />

    </div>
  );
}

export default UserHome;
