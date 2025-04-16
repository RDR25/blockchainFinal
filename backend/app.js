require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const userRoutes = require('./routes/userRoutes');
const officialRoutes = require('./routes/officialRoutes');
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const applicationDetailsRoutes = require('./routes/applicationDetailsRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const noteRoutes = require('./routes/noteRoutes');
const chatRoutes = require('./routes/chatRoutes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/email', emailRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/official', officialRoutes);
app.use('/api', authRoutes);
app.use('/api', passwordResetRoutes);
app.use('/api', applicationDetailsRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/chats', chatRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send('Welcome to LRM Backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
