import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { EMAIL_USER, EMAIL_PASS } = process.env;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
}

// Create a reusable transporter using SMTP
export const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can change this to another provider (e.g., "SendGrid", "Mailgun", "Yahoo")
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Common email options object
export const mailOptions = {
  from: `"Inkpulse Support" <${EMAIL_USER}>`,
};
