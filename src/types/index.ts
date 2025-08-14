
export interface Slot {
  id: string;
  date: string;
  time: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  slotId: string;
  name: string;
  email: string;
  reason: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'denied';
}