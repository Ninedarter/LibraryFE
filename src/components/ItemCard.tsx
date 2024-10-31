import { Card, CardContent, Typography } from '@mui/material'
import React, { useState } from 'react'
import '../components/components.css'
import ModalReservation from './ModalReservation';
import { Book } from '../interfaces/Book';

interface BookCardProps {
  title : string;
  author: string;
  year: number;
  imageUrl:string;
  bookToReserve: Book;
}



const BookCard: React.FC<BookCardProps> = ({ title, author, year, imageUrl, bookToReserve }) => {
 
  function handleMouseClick(){
    setIsOpen(true)
    console.log(bookToReserve.title);
    }
  const[isOpen, setIsOpen] = useState(false)
 
 return (
<div>
    <Card  sx={{ maxWidth: 300,  margin: '20px auto', padding: '10px' }}>
      <CardContent>
      <img 
      src={imageUrl} 
      alt={`${title} cover`}
      className="book-image" 
      onClick={handleMouseClick}
   
      />
        <Typography variant="h6" component="div" className="truncate">
          {title.length>14?  title.substring(0,14) + "..." : title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
        {author.length>14?  author.substring(0,14) + "..." : author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Published: {year}
        </Typography>
        
      </CardContent>
    </Card>
    <ModalReservation isOpen={isOpen} setIsOpen={setIsOpen} bookToReserve={bookToReserve}/>

  
    </div>
  );
};

export default BookCard