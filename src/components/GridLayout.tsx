import { Grid2 } from "@mui/material";
import { Book } from "../interfaces/Book";
import ItemCard from "./ItemCard";

interface GridLayoutProps{
    spacing: number;
    books: Book[] ;
}

const GridLayout: React.FC<GridLayoutProps> = ({ spacing, books }) => {
    return (
        <div>
<Grid2 container spacing={spacing}>
{books.map((book) => (
  <ItemCard title={book.title} author={book.author} year={book.year} imageUrl={book.imageUrl} bookToReserve={book} />
))}
</Grid2>
</div>
);};
export default GridLayout;