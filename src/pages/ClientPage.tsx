
import React, { useState, useEffect } from 'react';
import {
    Button,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import { Appointment } from '../types';

// Define the shape of the error response
interface ErrorResponse {
    message?: string;
}

const ClientPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('pending');
    const [message, setMessage] = useState('');

    const fetchAppointments = async () => {
        try {
            const response = await axios.get<Appointment[]>(
                'http://localhost:5000/api/bookings',
                { params: { status: statusFilter } }
            );
            //console.log('ClientPage fetched appointments:', response.data);
            setAppointments(response.data);
            setMessage('');
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
            console.error('Failed to fetch appointments:', errorMessage);
            setMessage(`Failed to fetch appointments: ${errorMessage}`);
        }
    };

    useEffect(() => {
        fetchAppointments();
        const interval = setInterval(fetchAppointments, 1000);
        return () => clearInterval(interval);
    }, [statusFilter]);

    const handleStatusUpdate = async (
        id: string,
        slotId: string,
        status: 'approved' | 'denied'
    ) => {
        try {
            await axios.put(`http://localhost:5000/api/bookings/${id}`, { status });
            setAppointments((prev) =>
                prev.map((app) => (app.id === id ? { ...app, status } : app))
            );
            setMessage(`Booking ${status} successfully.`);
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
            console.error('Failed to update status:', errorMessage);
            setMessage(`Failed to update appointment status: ${errorMessage}`);
        }
    };

    const exportToCSV = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/bookings/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'appointments.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setMessage('Appointments exported successfully.');
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
            console.error('Failed to export CSV:', errorMessage);
            setMessage(`Failed to export appointments: ${errorMessage}`);
        }

    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/del/${id}`);
            setAppointments((prev) => prev.filter((app) => app.id !== id));
            setMessage('Appointment deleted successfully.');
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
            console.error('Failed to delete appointment:', errorMessage);
            setMessage(`Failed to delete appointment: ${errorMessage}`);
        }
    };
    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Manage Appointments
            </Typography>
            {message && (
                <Typography color={message.includes('Failed') ? 'error' : 'primary'} gutterBottom>
                    {message}
                </Typography>
            )}
            <div style={{ marginBottom: '10px' }}>
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as string)}
                    displayEmpty
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="denied">Denied</MenuItem>
                </Select>
                <Button
                    variant="contained"
                    onClick={exportToCSV}
                    style={{ marginLeft: '10px' }}
                >
                    Export to CSV
                </Button>
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Slot</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {appointments.length > 0 ? (
                        appointments.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>{app.name}</TableCell>
                                <TableCell>{app.email}</TableCell>
                                <TableCell>{app.reason}</TableCell>
                                <TableCell>
                                    {app.date ? new Date(app.date).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell>{app.time || 'N/A'}</TableCell>
                                <TableCell>{app.slotId}</TableCell>
                                <TableCell>{app.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleStatusUpdate(app.id, app.slotId, 'approved')}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleStatusUpdate(app.id, app.slotId, 'denied')}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Deny
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDelete(app.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                No appointments found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ClientPage;









// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Typography,
// } from '@mui/material';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { Appointment } from '../types';

// const ClientPage: React.FC = () => {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [statusFilter, setStatusFilter] = useState<string>('');

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/bookings', {
//           params: { status: statusFilter },
//         });
//         setAppointments(response.data);
//       } catch (error) {
//         console.error('Failed to fetch appointments');
//       }
//     };
//     fetchAppointments();
//     const interval = setInterval(fetchAppointments, 5000);
//     return () => clearInterval(interval);
//   }, [statusFilter]);

//   const handleStatusUpdate = async (id: string, status: 'approved' | 'denied') => {
//     try {
//       await axios.put(`http://localhost:5000/api/bookings/${id}`, { status });
//       setAppointments(prev =>
//         prev.map(app => (app.id === id ? { ...app, status } : app))
//       );
//     } catch (error) {
//       console.error('Failed to update status');
//     }

//   };

//   const exportToCSV = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/bookings/export', {
//         responseType: 'blob', // Handle binary data
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'appointments.csv');
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Failed to export CSV');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
//       <Typography variant="h4">Manage Appointments</Typography>
//       <Select
//         value={statusFilter}
//         onChange={e => setStatusFilter(e.target.value)}
//         displayEmpty
//         style={{ margin: '10px 0' }}
//       >
//         <MenuItem value="">All</MenuItem>
//         <MenuItem value="pending">Pending</MenuItem>
//         <MenuItem value="approved">Approved</MenuItem>
//         <MenuItem value="denied">Denied</MenuItem>
//       </Select>
//       <Button variant="contained" onClick={exportToCSV} style={{ marginLeft: '10px' }}>
//         Export to CSV
//       </Button>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Name</TableCell>
//             <TableCell>Email</TableCell>
//             <TableCell>Reason</TableCell>
//             <TableCell>Slot</TableCell>
//             <TableCell>Date</TableCell>
//             <TableCell>Time</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {appointments.map(app => (
//             <TableRow key={app.id}>
//               <TableCell>{app.name}</TableCell>
//               <TableCell>{app.email}</TableCell>
//               <TableCell>{app.reason}</TableCell>
//               {/* <TableCell>{app.date}</TableCell>      */}
//               {/* <TableCell>{app.time}</TableCell>      */}
//               <TableCell>{app.slotId}</TableCell>
//               <TableCell>{app.status}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={() => handleStatusUpdate(app.id, 'approved')}
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={() => handleStatusUpdate(app.id, 'denied')}
//                   style={{ marginLeft: '10px' }}
//                 >
//                   Deny
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default ClientPage;