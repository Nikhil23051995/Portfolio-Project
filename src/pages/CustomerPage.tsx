import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { Slot } from '../types';

const CustomerPage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [form, setForm] = useState({ slotId: '', name: '', email: '', reason: '' });
  const [message, setMessage] = useState('');

  const fetchSlots = async () => {
    try {
      const response = await axios.get<Slot[]>('http://localhost:5000/api/slots', {
        params: { _t: Date.now() },
      });
      console.log('CustomerPage fetched slots:', response.data);
      setSlots(response.data);
    } catch (error: any) {
      console.error('Failed to fetch slots:', error.message);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBook = async () => {
    if (!form.slotId || !form.name || !form.email || !form.reason) {
      setMessage('⚠️ Please fill all details before booking.');
      setTimeout(() => {
        setMessage('');
      }, 10000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', form);
      setMessage(response.data.message); // "Appointment booked successfully. A confirmation email has been sent."
      setTimeout(() => {
        setMessage('');
      }, 10000);
      setForm({ slotId: '', name: '', email: '', reason: '' });
      fetchSlots();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage(`Error booking slot: ${errorMessage}`);
      setTimeout(() => {
        setMessage('');
      }, 10000);
      console.error('Failed to book slot:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Book an Appointment
      </Typography>
      {message && (
        <Typography color={message.includes('Error') || message.includes('⚠️') ? 'error' : 'primary'} gutterBottom>
          {message}
        </Typography>
      )}
      <List>
        {slots.length === 0 && (
          <Typography>No available slots at the moment</Typography>
        )}
        {slots.map(slot => (
          <ListItem key={slot.id} divider>
            <ListItemText
              primary={
                slot.date && slot.time
                  ? `${format(new Date(slot.date), 'PPPP')} at ${slot.time}`
                  : 'Invalid date or time'
              }
              secondary={slot.isBooked ? 'Booked' : 'Available'}
            />
            {!slot.isBooked && (
              <Button
                variant="contained"
                onClick={() => setForm({ ...form, slotId: slot.id })}
              >
                Select
              </Button>
            )}
          </ListItem>
        ))}
      </List>
      {form.slotId && (
        <div>
          <TextField
            label="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reason"
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleBook}>
            Book
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;









// import React, { useState, useEffect } from 'react';
// import { Button, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { Slot } from '../types';

// const CustomerPage: React.FC = () => {
//   const [slots, setSlots] = useState<Slot[]>([]); // Store slots
//   const [form, setForm] = useState({ slotId: '', name: '', email: '', reason: '' }); // Booking form
//   const [message, setMessage] = useState(''); // Feedback message

//   useEffect(() => { // Fetch slots on mount
//     fetchSlots();
//   }, []);

//   const fetchSlots = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/slots');
//       setSlots(response.data);
//     } catch (error) {
//       setMessage('Failed to fetch slots');
//     }
//   };
// useEffect(() => {
//   fetchSlots();
// }, []);
//   const handleBook = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/bookings', form);
//       setMessage(response.data.message);
//       setForm({ slotId: '', name: '', email: '', reason: '' }); // Reset form
//       fetchSlots(); // Refresh slots
//     } catch (error: any) {
//       setMessage(error.response?.data?.error || 'Error booking slot');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
//       <Typography variant="h4">Book an Appointment</Typography>
//       <List>
//         {slots.map(slot => (
//           <ListItem key={slot.id}>
//             <ListItemText
//               primary={format(new Date(slot.date), 'PPPPp')} // Format date
//               secondary={slot.isBooked ? 'Booked' : 'Available'}
//             />
//             {!slot.isBooked && (
//               <Button
//                 variant="contained"
//                 onClick={() => setForm({ ...form, slotId: slot.id })}
//               >
//                 Select
//               </Button>
//             )}
//           </ListItem>
//         ))}
//       </List>
//       {form.slotId && (
//         <div>
//           <TextField
//             label="Name"
//             value={form.name}
//             onChange={e => setForm({ ...form, name: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Email"
//             value={form.email}
//             onChange={e => setForm({ ...form, email: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Reason"
//             value={form.reason}
//             onChange={e => setForm({ ...form, reason: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <Button variant="contained" color="primary" onClick={handleBook}>
//             Book
//           </Button>
//           {message && <Typography color="error">{message}</Typography>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerPage;
