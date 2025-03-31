// Import required modules
import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Basic route
app.get('/', (req, res) => {
  res.send('Email API Server is running!');
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'info@sender.formiquejs.com',
      to,
      subject,
      html,
    });

    if (error) {
      return res.status(500).json({ error });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});