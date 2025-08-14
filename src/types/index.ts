// Define data structures for type safety
export interface Slot {
  id: string; // Unique slot ID (e.g., "slot-1")
  date: string; // ISO date string
  isBooked: boolean; // Booking status
}

export interface Appointment {
  id: string; // Unique appointment ID (UUID)
  slotId: string; // References Slot.id
  name: string; // Customer name
  email: string; // Customer email
  reason: string; // Appointment reason
  status: 'pending' | 'approved' | 'denied'; // Appointment status
}