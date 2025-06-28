const path = require('path');
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();  // <-- app must be declared BEFORE using it

app.use(cors());

// Middleware to parse JSON bodies (e.g. from Postman)
app.use(express.json());

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (HTML, CSS, JS) from current folder
app.use(express.static(path.join(__dirname))); // <-- now safe to use app

app.post("/send-message", async (req, res) => {
  // your POST handler here
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `New message from ${name}`,
    text: `You got a new message from your website contact form.\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Message:\n${message}`,
    replyTo: email
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
