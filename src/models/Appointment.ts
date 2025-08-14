import mongoose, { Schema } from 'mongoose';

const appointmentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  slotId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // String to match Slot
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending',
  },
});

export default mongoose.model('Appointment', appointmentSchema);