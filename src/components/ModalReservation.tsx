import { Box, Button, Checkbox, Dialog, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Book } from "../interfaces/Book";
import axios from 'axios';
import { useSnackbar } from 'notistack'; // Importing useSnackbar for notifications

interface ModalReservationProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  bookToReserve: Book;
}

const ModalReservation: React.FC<ModalReservationProps> = ({ isOpen, setIsOpen, bookToReserve }) => {
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [reservationDays, setReservationDays] = useState<number>(1);
  const [isQuickPickup, setIsQuickPickup] = useState<boolean>(false);
  const [bookType, setBookType] = useState<string>('physical');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar(); 

  const handleClose = () => {
    setIsOpen(false);
    setTotalAmount(null);
    setErrorMessage(null); 
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  const fetchTotalAmount = async () => {
    try {
      const response = await axios.post('https://localhost:7040/api/Calculation/calculateTotal', {
        title: bookToReserve.title,
        type: bookType,
        reservationDays,
        isQuickPickup
      });
      console.log("API Response:", response.data);
      setTotalAmount(response.data);
      setIsConfirmationOpen(true); 
      setErrorMessage(null); 
    } catch (error) {
      console.error("Error fetching total amount:", error);
      setErrorMessage("Error fetching total amount. Please try again.");
    }
  };

  const handleReserve = async () => {
    const reservationData = {
      title: bookToReserve.title,
      type: bookType,
      reservationDays,
      isQuickPickup
    };

    try {
      const response = await axios.post('https://localhost:7040/api/Reservation/makeReservation', reservationData);
      console.log("Reservation response:", response.data);
      enqueueSnackbar('Reservation successful!', { variant: 'success' }); 
      setIsConfirmationOpen(false);
      handleClose(); 
    } catch (error) {
      console.error("Error making reservation:", error);
      const axiosError = error as { response?: { status: number } };

      if (axiosError.response && axiosError.response.status === 404) {
        setErrorMessage("Cannot reserve the book. It is already taken until the specified date. Reservations page for details");
      } else {
        setErrorMessage("Error making reservation. Please try again."); 
      }
    }
  };

  return (
    <div>
      {/* Main Modal */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '500px',
            color: 'black',
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
          }
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button onClick={handleClose} sx={{ fontSize: 18, color: 'black', minWidth: 0 }}>✕</Button>
          </Box>

          <img
            src={bookToReserve.imageUrl}
            alt={`${bookToReserve.title} cover`}
            style={{
              width: '100px',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          />

          <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
            Reserve {bookToReserve.title}
          </Typography>

          <RadioGroup
            value={bookType}
            onChange={(e) => setBookType(e.target.value)}
            row
            sx={{ marginBottom: 2 }}
          >
            <FormControlLabel value="physical" control={<Radio />} label="Physical Book" />
            <FormControlLabel value="audiobook" control={<Radio />} label="Audiobook" />
          </RadioGroup>

          <FormControlLabel
            control={<Checkbox checked={isQuickPickup} onChange={(e) => setIsQuickPickup(e.target.checked)} />}
            label="Quick Pickup (+5€)"
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Reservation Days"
            type="number"
            value={reservationDays}
            onChange={(e) => setReservationDays(Number(e.target.value))}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <Button
            variant="contained"
            onClick={fetchTotalAmount}
            sx={{
              marginTop: 2,
              backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              width: '100%',
              marginBottom: 2
            }}
          >
            Next
          </Button>
        </Box>
      </Dialog>


      <Dialog
        open={isConfirmationOpen}
        onClose={handleConfirmationClose}
        aria-labelledby="confirmation-modal-title"
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '400px',
            color: 'black',
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
          }
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" id="confirmation-modal-title" sx={{ marginBottom: 2 }}>
            Are you sure you want to reserve a book "{bookToReserve.title}"?
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Total Amount: ${totalAmount}
          </Typography>

          {errorMessage && ( 
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Box display="flex" justifyContent="space-between" width="100%" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleReserve}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#43a047',
                },
                width: '48%',
              }}
            >
              Reserve
            </Button>
            <Button
              variant="outlined"
              onClick={handleConfirmationClose}
              sx={{
                color: '#d32f2f',
                borderColor: '#d32f2f',
                '&:hover': {
                  borderColor: '#c62828',
                  color: '#c62828',
                },
                width: '48%',
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ModalReservation;
