import Slot from './models/Slot';
import Appointment from './models/Appointment';
import { v4 as uuidv4 } from 'uuid';

export const seedSlots = async () => {
  try {
    // Clear existing data (only in development)
    if (process.env.NODE_ENV !== 'production') {
      await Slot.deleteMany({});
      await Appointment.deleteMany({});
      console.log('Cleared existing slots and appointments');
    }

    const existingSlots = await Slot.countDocuments();
    if (existingSlots === 0) {
      const today = new Date(); // August 13, 2025
      const slots = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        date.setHours(10, 0, 0, 0); // 10 AM IST
        const slot = {
          id: `slot-${i + 1}`,
          date,
          time: '10:00 AM',
          isBooked: i === 0, // Book first slot for testing
        };
        slots.push(slot);
        await Slot.create(slot);
      }
      console.log('Seeded 7 dynamic slots for the current week.');

      // Seed one sample appointment
      if (slots[0]) {
        await Appointment.create({
          id: uuidv4(),
          slotId: slots[0].id,
          name: 'Test User',
          email: 'test@example.com',
          reason: 'Sample consultation',
          date: slots[0].date,
          time: slots[0].time,
          status: 'pending',
        });
        console.log('Seeded 1 sample appointment.');
      }
    } else {
      console.log('Slots already exist, skipping seeding.');
    }
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};






// import Slot from './models/Slot';

// export const seedSlots = async () => {
//   const existingSlots = await Slot.countDocuments();
//   if (existingSlots === 0) {
//     const today = new Date(); // August 13, 2025
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       date.setHours(10, 0, 0, 0); // 10 AM IST
//       await Slot.create({
//         id: `slot-${i + 1}`,
//         date,
//         isBooked: false,
//       });
//     }
//     console.log('Seeded 7 dynamic slots for the current week.');
//   }
// };
