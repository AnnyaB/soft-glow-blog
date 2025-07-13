const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Send index.html for root route (optional, if you want SPA style)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// 👇 ADD THIS JUST BEFORE YOUR app.listen()
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Mongoose Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });

  res.status(201).json({ message: "Registration successful" });
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2d' });
  res.json({ token });
});

// Middleware to protect /perks
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Protected Perks Endpoint
app.get('/api/perks', authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, here are your pink girly perks! 💖✨` });
});

// Wallet Schema & Model
const WalletSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  dateEarned: { type: Date, default: Date.now },
});
const Wallet = mongoose.model('Wallet', WalletSchema);

// Add Perk to Wallet
app.post('/api/wallet/add', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ message: "Missing perk data" });

  try {
    const newPerk = await Wallet.create({
      userId: req.user.id,
      name,
      description
    });
    res.status(201).json(newPerk);
  } catch (err) {
    res.status(500).json({ message: "Error saving to wallet" });
  }
});

// Get Wallet Perks
app.get('/api/wallet', authMiddleware, async (req, res) => {
  try {
    const perks = await Wallet.find({ userId: req.user.id }).sort({ dateEarned: -1 });
    res.json(perks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching wallet" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
