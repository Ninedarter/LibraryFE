import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, TextField, Button } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";

interface ReservationProps {
    onSubmit: (data: ReservationData) => void;
    title: string; // Title prop
}

interface ReservationData {
    title: string;
    type: string;
    numberOfDays: number;
    isQuickPickup: boolean;
}

const ReservationForm: React.FC<ReservationProps> = ({ onSubmit, title }) => {

    const [formTitle, setFormTitle] = useState<string>(title); 
    const [bookType, setBookType] = useState<string>("physical"); 
    const [numberOfDays, setNumberOfDays] = useState<number>(0); 
    const [isQuickPickup, setIsQuickPickup] = useState<boolean>(false); 

   
    useEffect(() => {
        setFormTitle(title);
    }, [title]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = event.target;
        
        switch (name) {
            case "type":
                setBookType(value);
                break;
            case "numberOfDays":
                setNumberOfDays(Number(value));
                break;
            case "isQuickPickup":
                setIsQuickPickup(checked);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        
        const reservationData: ReservationData = {
            title: formTitle,
            type: bookType,
            numberOfDays: numberOfDays,
            isQuickPickup: isQuickPickup,
        };

        onSubmit(reservationData);

        axios.post("https://localhost:7040/api/Reservation/makeReservation", reservationData)
        .then((response) => {
            console.log(response.data); 
        })
        .catch((error) => {
            console.error("Error making reservation:", error); 
        });
}; 
 
    return (
        <form onSubmit={handleSubmit}>
            <FormControl sx={{
                marginTop: "20px",
                marginLeft: "20px"
            }}>
                <FormLabel>{formTitle}</FormLabel>
                <FormLabel id="demo-row-radio-buttons-group-label">Type</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="type"
                    value={bookType}
                    onChange={handleInputChange}
                >
                    <FormControlLabel value="physical" control={<Radio />} label="Physical book" />
                    <FormControlLabel value="audio" control={<Radio />} label="Audiobook" />
                </RadioGroup>
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={isQuickPickup}
                            onChange={handleInputChange}
                            name="isQuickPickup"
                        />
                    }
                    label="Quick pickup (+5€)"
                />
                <TextField
                    type="number"
                    name="numberOfDays"
                    value={numberOfDays}
                    label="Reservation days"
                    variant="outlined"
                    onChange={handleInputChange}
                />
            </FormControl>
            <Button variant='contained' type="button" >Close</Button>
            <Button variant='contained' type="submit">Reserve</Button>
        </form>
    );
}

export default ReservationForm;
