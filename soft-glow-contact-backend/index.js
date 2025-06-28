const path = require('path');

// Serve static frontend files (HTML, CSS, JS) from current folder
app.use(express.static(path.join(__dirname)));

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

// Middleware to parse JSON bodies (e.g. from Postman)
app.use(express.json());

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

app.post("/send-message", async (req, res) => {
  // Destructure form fields from req.body
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // Configure transporter using your Gmail account from .env
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Prepare mail options with sender's email included
  const mailOptions = {
    from: process.env.EMAIL_USER,       // Your Gmail (sender)
    to: process.env.RECEIVER_EMAIL,     // Your Gmail (receiver)
    subject: `New message from ${name}`,
    text: `You got a new message from your website contact form.\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +           // Include sender's email here
          `Message:\n${message}`,
    replyTo: email                       // Reply will go to the sender's email
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


