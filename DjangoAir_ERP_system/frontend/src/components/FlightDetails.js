import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, Form} from 'react-bootstrap';

const FlightDetails = ({flightId, handleBack}) => {
    const [seatTypes, setSeatTypes] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedSeatType, setSelectedSeatType] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

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

    const handleSeatTypeChange = (event) => {
        const selectedType = event.target.value;
        const seatType = seatTypes.find((type) => type.seat_type === selectedType);
        setSelectedSeatType(seatType);
    };

    const handleOptionChange = (event) => {
        const selectedOptionId = parseInt(event.target.value);
        const option = options.find((opt) => opt.id === selectedOptionId);

        if (event.target.checked) {
            setSelectedOptions((prevOptions) => [...prevOptions, option]);
        } else {
            setSelectedOptions((prevOptions) =>
                prevOptions.filter((opt) => opt.id !== selectedOptionId)
            );
        }
    };

    const calculateTotalPrice = () => {
        let totalPrice = selectedSeatType ? selectedSeatType.price : 0;

        for (const option of selectedOptions) {
            totalPrice += option.price;
        }

        return totalPrice;
    };

    return (
        <div>
            <h2>Seat Type Options</h2>
            <p>Flight ID: {flightId}</p>

            {/* Render the seat types */}
            <h3>Seat Types</h3>
            <Form>
                {seatTypes.map((seatType) => (
                    <Form.Check
                        key={seatType.id}
                        type="radio"
                        label={`${seatType.seat_type} Price ${seatType.price} Quantity of seats ${seatType.quantity}`}
                        value={seatType.seat_type}
                        name="seatType"
                        checked={selectedSeatType && selectedSeatType.id === seatType.id}
                        onChange={handleSeatTypeChange}
                    />
                ))}
                <h3>Options</h3>
                {options.map((option) => (
                    <Form.Check
                        key={option.id}
                        type="checkbox"
                        label={`${option.name} Price ${option.price}`}
                        value={option.id}
                        checked={selectedOptions.some((opt) => opt.id === option.id)}
                        onChange={handleOptionChange}
                    />
                ))}
            </Form>

            {/* Display the total price */}
            <p>Total Price: {calculateTotalPrice()}</p>

            <Button variant="secondary" onClick={handleBack}>
                Back
            </Button>
        </div>
    );
};

export default FlightDetails;
