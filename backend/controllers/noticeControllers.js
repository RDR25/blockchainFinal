const fs = require('fs');
const path = require('path');

const getNotices = (req, res) => {
  // Build the path to the notices directory (adjust if your folder structure differs)
  const noticesDir = path.join(__dirname, '..', 'uploads', 'notices');
  
  fs.readdir(noticesDir, (err, files) => {
    if (err) {
      console.error('Error reading notices directory:', err);
      return res.status(500).json({ success: false, message: 'Unable to retrieve notices' });
    }
    // Map each file to an object; you can add additional file info if needed.
    const notices = files.map(file => ({ filename: file }));
    return res.status(200).json({ success: true, notices });
  });
};

module.exports = { getNotices };
