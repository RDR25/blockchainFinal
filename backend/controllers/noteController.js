const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const { type, username } = req.query;
    if (!type || !username) {
      return res.status(400).json({ message: 'Type and username required' });
    }
    const notes = await Note.find({ type, username }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { type, username, notes } = req.body;
    if (!type || !username || !notes) {
      return res.status(400).json({ message: 'Type, username, and notes required' });
    }
    const newNote = new Note({ type, username, notes });
    await newNote.save();
    return res.status(201).json({ success: true, note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
