import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('https://localhost:7040/api/Reservation/all'); 
        setReservations(response.data);
      } catch (err) {
        setError('Failed to fetch reservations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Reservations
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {reservations.length === 0 ? (
        <Typography>No reservations found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reservation ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Days to Reserve</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Reservation Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.reservationId}> 
                  <TableCell>{reservation.reservationId}</TableCell>
                  <TableCell>{reservation.title}</TableCell>
                  <TableCell>{reservation.daysToReserve}</TableCell> 
                  <TableCell>{reservation.totalAmount.toFixed(2)} $</TableCell> 
                  <TableCell>{new Date(reservation.reservationDate).toLocaleDateString()}</TableCell> 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Button
        variant="outlined"
        onClick={() => window.location.href = '/'} // Navigate back to the main page
        sx={{
          marginTop: 2,
          color: '#1976d2',
          borderColor: '#1976d2',
          '&:hover': {
            borderColor: '#1565c0',
            color: '#1565c0',
          },
        }}
      >
        Go Back to Main
      </Button>
    </Box>
  );
};

export default Reservations;
