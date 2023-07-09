import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, Form} from "react-bootstrap";

const FlightDetails = ({flightId, handleBack}) => {
    const [seatTypes, setSeatTypes] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        axios
            .get('/api/flight/options/', {
                params: {
                    flight_id: flightId,
                },
            })
            .then((response) => {
                setSeatTypes(response.data.seat_types);
                setOptions(response.data.options);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [flightId]);

    return (
        <div>
            <h2>Seat Type Options</h2>
            <p>Flight ID: {flightId}</p>
            {/* Render the seat types and options */}
            <h3>Seat Types</h3>
            <ul>
                {seatTypes.map((seatType) => (
                    <li key={seatType.id}> {seatType.seat_type} Price {seatType.price} Quantity of seats {seatType.quantity}</li>
                ))}
            </ul>
            <h3>Options</h3>
            <ul>
                {options.map((option) => (
                    <li key={option.id}>{option.name} Price {option.price}</li>
                ))}
            </ul>
            <Button variant="secondary" onClick={handleBack}>
                Back
            </Button>

        </div>
    );
};

export default FlightDetails;
