import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { Book } from './interfaces/Book';
import GridLayout from './components/GridLayout';
import Reservations from './pages/Reservations';

const BASE_URL = "https://localhost:7040/api/Book";

function AppContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchField, setSearchField] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(`${BASE_URL}`)
        .then((response) => response.json())
        .then((books) => {
          setBooks(books.value);
          setFilteredBooks(books.value);
        })
        .catch((error) => console.error('Error fetching books:', error));
    };

    fetchBooks();
  }, []);

  const handleInputChange = (input: string) => {
    const filteredBooks = books.filter((book) =>
      book.title.toLocaleLowerCase().includes(input.toLocaleLowerCase()) ||
      book.author.toLocaleLowerCase().includes(input.toLocaleLowerCase()) ||
      book.year.toString().includes(input.toLocaleLowerCase())
    );

    setSearchField(input);
    setFilteredBooks(filteredBooks);
  };

  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  return (
    <Box>
      {/* Search and Navigation Button */}
      {location.pathname !== '/reservations' && ( // Show search and button only if not on reservations page
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            gap: '10px',
          }}
        >
          <TextField
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder='Search books by title, author or release year'
            variant="outlined"
            sx={{
              width: '50%',
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/reservations')}
          >
            Reservations
          </Button>
        </Box>
      )}

      {/* Define Routes */}
      <Routes>
        <Route path="/reservations" element={<Reservations />} />
      </Routes>

      {/* Show GridLayout if not on the reservations page */}
      {location.pathname !== '/reservations' && (
        <GridLayout spacing={2} books={filteredBooks} />
      )}
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
