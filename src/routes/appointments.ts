import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Parser } from 'json2csv';
import Slot from '../models/Slot';
import Appointment from '../models/Appointment';
import { Transporter } from 'nodemailer';
import Express from 'express'; // Import Express for typing

// Extend Express Request to include transporter
interface CustomRequest extends Request {
  app: Express.Application & { get(name: 'transporter'): Transporter };
}

const router = Router();

// Get all available slots
router.get('/slots', async (_req: Request, res: Response) => {
  try {
    const slots = await Slot.find({ isBooked: false });
    console.log('Fetched slots for /api/slots:', slots.map(s => s.toObject()));
    res.set('Cache-Control', 'no-store');
    res.json(slots);
  } catch (error: any) {
    console.error('Error fetching slots:', error.message);
    res.status(500).json({ message: 'Error fetching slots', error: error.message });
  }
});

// Book an appointment
router.post('/bookings', async (req: CustomRequest, res: Response) => {
  const { slotId, name, email, reason } = req.body as {
    slotId: string;
    name: string;
    email: string;
    reason: string;
  };
  try {
    if (!slotId || !name || !email || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const slot = await Slot.findOne({ id: slotId });
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot unavailable' });
    }
    slot.isBooked = true;
    await slot.save();
    const appointment = new Appointment({
      id: uuidv4(),
      slotId,
      name,
      email,
      reason,
      date: slot.date,
      time: slot.time,
      status: 'pending',
    });
    await appointment.save();
    console.log('Booking created:', {
      appointment: appointment.toObject(),
      slotDate: slot.date,
      slotTime: slot.time,
    });

    // Send confirmation email
    const transporter = req.app.get('transporter') as Transporter;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Booking Confirmation',
      text: `Dear ${name},\n\nYour appointment has been booked successfully!\n\nDetails:\n- Date: ${new Date(slot.date).toLocaleDateString()}\n- Time: ${slot.time}\n- Reason: ${reason}\n\nYour appointment is pending approval. We'll notify you once it's confirmed.\n\nBest regards,\nAppointment Booking Team`,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${email}`);
    } catch (emailError: any) {
      console.error('Failed to send email:', emailError.message);
    }

    res.json({ message: 'Appointment booked successfully. A confirmation email has been sent.', appointment });
  } catch (error: any) {
    console.error('Error booking appointment:', error.message);
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
});

// Get all bookings
router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const statusFilter = req.query.status as string | undefined;
    const query = statusFilter ? { status: statusFilter } : {};
    const bookings = await Appointment.find(query);
    console.log('Fetched bookings for /api/bookings:', bookings.map(b => b.toObject()));
    res.json(bookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Approve or deny booking
router.put('/bookings/:id', async (req: CustomRequest, res: Response) => {
  const { status } = req.body as { status: 'pending' | 'approved' | 'denied' };
  try {
    const appointment = await Appointment.findOne({ id: req.params.id });
    if (!appointment) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    appointment.status = status;
    await appointment.save();

    const transporter = req.app.get('transporter') as Transporter;
    if (status === 'approved') {
      // Send approval email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: appointment.email,
        subject: 'Appointment Approval Notification',
        text: `Dear ${appointment.name},\n\nYour appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been approved!\n\nReason: ${appointment.reason}\n\nWe look forward to seeing you.\n\nBest regards,\nAppointment Booking Team`,
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${appointment.email}`);
      } catch (emailError: any) {
        console.error('Failed to send approval email:', emailError.message);
      }
    } else if (status === 'denied') {
      const slotUpdate = await Slot.updateOne(
        { id: appointment.slotId },
        { $set: { isBooked: false } }
      );
      console.log(`Slot update for ${appointment.slotId}:`, slotUpdate);
      if (slotUpdate.modifiedCount === 0) {
        console.warn(`No slot updated for slotId: ${appointment.slotId}`);
      }

      // Send denial email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: appointment.email,
        subject: 'Appointment Status Update',
        text: `Dear ${appointment.name},\n\nYour appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been denied.\n\nReason: ${appointment.reason}\n\nPlease book another slot if needed.\n\nBest regards,\nAppointment Booking Team`,
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Denial email sent to ${appointment.email}`);
      } catch (emailError: any) {
        console.error('Failed to send denial email:', emailError.message);
      }
    }
    console.log(`Booking updated to ${status}:`, appointment.toObject());
    res.json({ message: `Booking ${status}`, appointment });
  } catch (error: any) {
    console.error('Error updating booking:', error.message);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Delete appointment by appointment.id and free its slot
router.delete('/del/:id', async (req: CustomRequest, res: Response) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ id: req.params.id });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const slotUpdate = await Slot.updateOne(
      { id: appointment.slotId },
      { $set: { isBooked: false } }
    );
    console.log(`Slot update for ${appointment.slotId}:`, slotUpdate);
    if (slotUpdate.modifiedCount === 0) {
      console.warn(`No slot updated for slotId: ${appointment.slotId}`);
    }

    // Send cancellation email
    const transporter = req.app.get('transporter') as Transporter;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.email,
      subject: 'Appointment Cancellation Notification',
      text: `Dear ${appointment.name},\n\nYour appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been canceled.\n\nReason: ${appointment.reason}\n\nPlease book another slot if needed.\n\nBest regards,\nAppointment Booking Team`,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Cancellation email sent to ${appointment.email}`);
    } catch (emailError: any) {
      console.error('Failed to send cancellation email:', emailError.message);
    }

    res.json({ message: 'Appointment canceled and slot freed successfully. A cancellation email has been sent.' });
  } catch (error: any) {
    console.error('Error deleting appointment:', error.message);
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
});

// Export bookings as CSV
router.get('/bookings/export', async (_req: Request, res: Response) => {
  try {
    const bookings = await Appointment.find();
    const fields = ['id', 'slotId', 'name', 'email', 'reason', 'status', 'date', 'time'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(bookings);
    res.header('Content-Type', 'text/csv');
    res.attachment('bookings.csv');
    res.send(csv);
  } catch (error: any) {
    console.error('Error exporting bookings:', error.message);
    res.status(500).json({ message: 'Error exporting bookings', error: error.message });
  }
});

export default router;





// import { Router } from 'express';
// import { v4 as uuidv4 } from 'uuid';
// import { Parser } from 'json2csv';
// import Slot from '../models/Slot';
// import Appointment from '../models/Appointment';

// const router = Router();

// // Get all available slots
// router.get('/slots', async (req, res) => {
//   try {
//     const slots = await Slot.find({ isBooked: false });
//     res.json(slots);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching slots', error });
//   }
// });

// // Book an appointment
// router.post('/bookings', async (req, res) => {
//   const { slotId, name, email, reason } = req.body;
//   try {
//     const slot = await Slot.findOne({ id: slotId });
//     if (!slot || slot.isBooked) {
//       return res.status(400).json({ message: 'Slot unavailable' });
//     }
//     slot.isBooked = true;
//     await slot.save();
//     const appointment = new Appointment({
//       id: uuidv4(),
//       slotId,
//       name,
//       email,
//       reason,
//       date: slot.date,       // store date
//       time: slot.time,       // store time
//       status: 'pending',
//     });
//     await appointment.save();
//     console.log(`Calendar Invite: Sending invite to ${email} for slot ${slotId}`);
//     res.json({ message: 'Appointment booked', appointment });
//   } catch (error) {
//     res.status(500).json({ message: 'Error booking appointment', error });
//   }
// });

// // Get all bookings
// router.get('/bookings', async (req, res) => {
//   try {
//     const bookings = await Appointment.find();
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching bookings', error });
//   }
// });

// // Approve or deny booking
// router.put('/bookings/:id', async (req, res) => {
//   const { status } = req.body;
//   try {
//     const appointment = await Appointment.findById({ id: req.params.id });
//     if (!appointment) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
//     appointment.status = status;
//     await appointment.save();
//     // If denied → make slot available again
//     if (status === 'Denied') {
//       await Slot.updateOne(
//         { slotId: appointment.slotId },
//         { $set: { isAvailable: true } }
//       );
//     }
//     res.json({ message: `Booking ${status}`, appointment });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating booking', error });
//   }
// });

// // Export bookings as CSV
// router.get('/bookings/export', async (req, res) => {
//   try {
//     const bookings = await Appointment.find();
//     const fields = ['id', 'slotId', 'name', 'email', 'reason', 'status'];
//     const json2csv = new Parser({ fields });
//     const csv = json2csv.parse(bookings);
//     res.header('Content-Type', 'text/csv');
//     res.attachment('bookings.csv');
//     res.send(csv);
//   } catch (error) {
//     res.status(500).json({ message: 'Error exporting bookings', error });
//   }
// });

// export default router;