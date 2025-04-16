/**
 * MinistryWelfareDashboard.js (Final)
 * ------------------------------------
 * File Name: MinistryWelfareDashboard
 * Description: Styled dashboard for Ministry Welfare with 2x2 layout, proper theme and section styling.
 * DO NOT MODIFY BACKEND OR STRUCTURE.
 */
/**
 * MinistryWelfareDashboard.js (Final)
 * --------------------------------------
 * File Name: MinistryWelfareDashboard
 * Description: Styled dashboard for District Collector with 2x2 grid, correct gradient/theme, and layout.
 * DO NOT MODIFY BACKEND OR STRUCTURE.
 */

/**
 * MinistryWelfareDashboard.js (Fixed)
 * ------------------------------
 * File Name: MinistryWelfareDashboard
 * Description: Styled dashboard for Clerk with separated Pending and Rejected Applications cards.
 * DO NOT MODIFY BACKEND OR STRUCTURE.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';

function MinistryWelfareDashboard() {
  const navigate = useNavigate();
    const [official, setOfficial] = useState(null);
    const [notices, setNotices] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [recentCount, setRecentCount] = useState(0);
    const [pendingWithUserCount, setPendingWithUserCount] = useState(0);
    const [pendingWithUserOldCount, setPendingWithUserOldCount] = useState(0);
    // New state variables for Rejected Applications
    const [rejectedCount, setRejectedCount] = useState(0);
    const [rejectedRecentCount, setRejectedRecentCount] = useState(0);
  
    // Notes widget state
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [userNotes, setUserNotes] = useState([]);
  
    // Define backend URL
    const backendUrl = "http://localhost:5000";
  
    // Retrieve official details from localStorage
    useEffect(() => {
      const storedOfficial = localStorage.getItem("official");
      if (storedOfficial) {
        setOfficial(JSON.parse(storedOfficial));
      }
    }, []);
  
    // Fetch notices from backend
    useEffect(() => {
      fetch(`${backendUrl}/api/notices`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setNotices(data.notices);
          }
        })
        .catch(error => console.error('Error fetching notices:', error));
    }, [backendUrl]);
  
    // Fetch all sent applications and calculate counts
    useEffect(() => {
      fetch(`${backendUrl}/api/applicationdetails/sent?all=true`)
        .then(response => response.json())
        .then(data => {
          if (data.applications) {
            // Applications sent to Ministry of Welfare
            const sentApps = data.applications.filter(app => app.status === "Sent to Ministry of Welfare");
            setPendingCount(sentApps.length);
            
            // Applications received in the last 5 days
            const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
            const recentApps = sentApps.filter(app => new Date(app.createdtimestamp) >= fiveDaysAgo);
            setRecentCount(recentApps.length);
            
            // Applications with status "Rejected by Ministry of Welfare"
            const rejectedApps = data.applications.filter(app => app.status === "Rejected by Ministry of Welfare");
            setRejectedCount(rejectedApps.length);
            // Applications rejected in the last 2 days
            const twoDaysAgoForRejected = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            const rejectedRecentApps = rejectedApps.filter(app => new Date(app.lastmodifiedtimestamp) >= twoDaysAgoForRejected);
            setRejectedRecentCount(rejectedRecentApps.length);
          }
        })
        .catch(error => console.error('Error fetching sent applications:', error));
    }, [backendUrl]);
  
    // Fetch notes for the logged in official (type "ministry_welfare")
    const fetchUserNotes = () => {
      if (official && official.officialid) {
        fetch(`${backendUrl}/api/notes?type=ministry_welfare&username=${official.officialid}`)
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              setUserNotes(data.notes);
            }
          })
          .catch(error => console.error('Error fetching notes:', error));
      }
    };
  
    useEffect(() => {
      if (official && official.officialid) {
        fetchUserNotes();
      }
    }, [official]);
  
    // Add a note with type "ministry_welfare"
    const handleAddNote = () => {
      if (!noteText.trim()) return;
      fetch(`${backendUrl}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ministry_welfare",
          username: official.officialid,
          notes: noteText
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setNoteText("");
            setShowNoteInput(false);
            fetchUserNotes();
          }
        })
        .catch(error => console.error("Error adding note:", error));
    };
  
    // Delete a note
    const handleDeleteNote = (id) => {
      fetch(`${backendUrl}/api/notes/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            fetchUserNotes();
          }
        })
        .catch(error => console.error("Error deleting note:", error));
    };
  
    // Helper: return file icon based on extension
    const getFileIcon = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      if (ext === 'pdf') {
        return <i className="fas fa-file-pdf" style={{ color: '#d9534f' }}></i>;
      } else if (ext === 'doc' || ext === 'docx') {
        return <i className="fas fa-file-word" style={{ color: '#337ab7' }}></i>;
      } else {
        return <i className="fas fa-file-alt" style={{ color: '#5cb85c' }}></i>;
      }
    };
  
    // Logout handler
    const handleLogout = () => {
      localStorage.clear();
      navigate('/');
    };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ background: 'linear-gradient(to right, #434343, #000000)', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">E-Land Records</Typography>
          <Typography variant="h4" fontWeight={600} sx={{ color: 'white' }}>Ministry Welfare Dashboard</Typography>
          <Button onClick={handleLogout} variant="contained" sx={{ bgcolor: '#434343', color: '#fff', '&:hover': { bgcolor: '#000000' } }}>
            <i className="fas fa-sign-out-alt"></i>
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ width: 80, background: 'linear-gradient(to bottom, #868f96, #596164)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
            {[{ icon: 'globe', path: '/ministrywelfarehome' }, { icon: 'sign-out-alt', action: handleLogout }].map((item, i) => (
              <Box key={i} sx={{ mb: 3, cursor: 'pointer', '&:hover': { color: '#e2ebf0' } }} onClick={() => item.path ? navigate(item.path) : item.action?.()}>
                <i className={`fas fa-${item.icon}`}></i>
              </Box>
            ))}
          </Box>

          <Box flex={1} p={3} display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
            <Paper elevation={3} sx={{ p: 2, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
              <Typography variant="h6" fontWeight="bold"><i className="fas fa-hourglass-half" style={{ marginRight: 8 }}></i>Pending Applications</Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Paper sx={{ p: 2, flex: 1, minWidth: 180, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
                  <Typography fontWeight={600}>Total Pending Applications</Typography>
                  <Typography variant="h4">{pendingCount}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, minWidth: 180, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
                  <Typography fontWeight={600}>Received in Last 5 Days</Typography>
                  <Typography variant="h4">{recentCount}</Typography>
                </Paper>
              </Box>
            </Paper>

           
            <Paper elevation={3} sx={{ p: 2, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold"><i className="fas fa-sticky-note" style={{ marginRight: 8 }}></i>Notes</Typography>
                <IconButton onClick={() => setShowNoteInput(true)}><AddIcon /></IconButton>
              </Box>
              {showNoteInput && (
                <Box>
                  <TextField fullWidth multiline rows={2} value={noteText} onChange={(e) => setNoteText(e.target.value)} sx={{ background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)', borderRadius: 1 }} />
                  <Box mt={1}>
                    <Button onClick={handleAddNote} variant="contained" sx={{ bgcolor: '#434343', color: 'white', '&:hover': { bgcolor: '#000000' }, mr: 1 }}>Save</Button>
                    <Button onClick={() => setShowNoteInput(false)} variant="outlined" color="error">Cancel</Button>
                  </Box>
                </Box>
              )}
              {userNotes.map(note => (
                <Paper key={note._id} sx={{ p: 2, mt: 1, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>{note.notes}</Typography>
                    <Button onClick={() => handleDeleteNote(note._id)} color="error">Delete</Button>
                  </Box>
                </Paper>
              ))}
            </Paper>
            <Paper elevation={3} sx={{ p: 2, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
              <Typography variant="h6" fontWeight="bold"><i className="fas fa-ban" style={{ marginRight: 8 }}></i>Rejected Applications</Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Paper sx={{ p: 2, flex: 1, minWidth: 180, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
                  <Typography fontWeight={600}>Rejected by Ministry of Welfare</Typography>
                  <Typography variant="h4">{rejectedCount}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, minWidth: 180, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
                  <Typography fontWeight={600}>Rejected in last 2 days</Typography>
                  <Typography variant="h4">{rejectedRecentCount}</Typography>
                </Paper>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 2, background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)' }}>
              <Typography variant="h6" fontWeight="bold"><i className="fas fa-bullhorn" style={{ marginRight: 8 }}></i>Notice Board</Typography>
              {notices.map((notice, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getFileIcon(notice.filename)}
                  <a href={`${backendUrl}/uploads/notices/${notice.filename}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#003520' }}>
                    {notice.filename}
                  </a>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default MinistryWelfareDashboard;
