import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import appointmentRoutes from './routes/appointments';
import { seedSlots } from './seed';

dotenv.config();

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify Nodemailer configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', error.message);
  } else {
    console.log('Nodemailer ready to send emails');
  }
});

// Make transporter available to routes
app.set('transporter', transporter);

app.use('/api', appointmentRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/appointment-booking';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    await seedSlots();
    console.log('Database seeding completed');
  })
  .catch(err => console.error('MongoDB connection error:', err.message));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));