const bcrypt = require('bcrypt');
const UserProfile = require('../models/UserProfile');
const OfficialProfile = require('../models/OfficialProfile');

exports.userLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await UserProfile.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Login successful – you can return a token or user data as needed
    return res.status(200).json({ 
        message: "User login successful", 
        user: { 
          firstname: user.firstname, 
          photo: user.photo, 
          username: user.username, 
          lastname: user.lastname
        } 
      });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.officialLogin = async (req, res) => {
  const { officialId, role, password } = req.body;
  try {
    // Find official by officialid
    const official = await OfficialProfile.findOne({ officialid: officialId });
    if (!official) {
      return res.status(401).json({ message: "Invalid official ID or password" });
    }
    // Check if the provided role matches the stored designation
    if (official.designation !== role) {
      return res.status(401).json({ message: "Invalid designation" });
    }
    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, official.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid official ID or password" });
    }
    return res.status(200).json({ message: "Official login successful", official });
  } catch (error) {
    console.error("Official login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
