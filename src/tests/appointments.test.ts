import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import Slot from '../models/Slot';
import Appointment from '../models/Appointment';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-appointment-booking');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Appointment API', () => {
  beforeEach(async () => {
    await Slot.deleteMany({});
    await Appointment.deleteMany({});
    await Slot.create({ id: 'slot-1', date: new Date(), isBooked: false });
  });

  it('POST /api/bookings should create a booking', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({
        slotId: 'slot-1',
        name: 'John Doe',
        email: 'john@example.com',
        reason: 'Consultation',
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Booking created successfully');
  });

  it('POST /api/bookings should fail for missing fields', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({ slotId: 'slot-1' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });
});