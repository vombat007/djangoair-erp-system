import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, Form} from 'react-bootstrap';
import BookingForm from './BookingForm';

const FlightDetails = ({flightId, handleBack}) => {
    const [seatTypes, setSeatTypes] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [availableSeats, setAvailableSeats] = useState([]);

    useEffect(() => {
        axios
            .get('/api/flight/details/', {
                params: {
                    flight_id: flightId,
                },
            })
            .then((response) => {
                setSeatTypes(response.data.seat_types);
                setOptions(response.data.options);
                setAvailableSeats(response.data.seats.filter((seat) => !seat.is_booked));
            })
            .catch((error) => {
                console.error(error);
            });
    }, [flightId]);

    // Function to filter available seats based on the selected seat type
    const filterAvailableSeats = (selectedSeatType) => {
        return availableSeats.filter((seat) => seat.seat_type === selectedSeatType.id);
    };

    const handleSeatTypeChange = (event) => {
        const selectedType = event.target.value;
        const seatType = seatTypes.find((type) => type.seat_type === selectedType);

        // Filter available seats based on the selected seat type
        const filteredSeats = filterAvailableSeats(seatType);

        setSelectedSeat(seatType);
        setAvailableSeats(filteredSeats);
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
        let totalPrice = selectedSeat ? selectedSeat.price : 0;

        for (const option of selectedOptions) {
            totalPrice += option.price;
        }

        return totalPrice;
    };

    const handleNextStep = () => {
        setShowBookingForm(true);
    };

    const handleBookingComplete = () => {
        setSelectedSeat({}); // Reset to an empty object instead of null
        setSelectedOptions([]);
        setShowBookingForm(false);
    };

    return (
        <div>
            {!showBookingForm ? (
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
                                label={`${seatType.seat_type} Price ${seatType.price}$ Quantity of seats ${seatType.quantity}`}
                                value={seatType.seat_type}
                                name="seatType"
                                checked={selectedSeat && selectedSeat.id === seatType.id}
                                onChange={handleSeatTypeChange}
                            />
                        ))}
                        <h3>Options</h3>
                        {options.map((option) => (
                            <Form.Check
                                key={option.id}
                                type="checkbox"
                                label={`${option.name} Price ${option.price}$`}
                                value={option.id}
                                checked={selectedOptions.some((opt) => opt.id === option.id)}
                                onChange={handleOptionChange}
                            />
                        ))}
                    </Form>

                    {/* Display the total price */}
                    <p>Total Price: {calculateTotalPrice()}$</p>

                    {/* Add back button */}
                    <Button variant="secondary" onClick={handleBack}>
                        Back
                    </Button>

                    <Button variant="primary" onClick={handleNextStep}>
                        Next Step
                    </Button>
                </div>
            ) : (
                <BookingForm
                    flightId={flightId}
                    selectedSeat={availableSeats.length > 0 ? availableSeats[0].id : null}
                    selectedOptions={selectedOptions}
                    totalPrice={calculateTotalPrice()}
                    onBack={handleBack} // Pass handleBack function to BookingForm component
                    onBookingComplete={handleBookingComplete}
                />
            )}
        </div>
    );
};

export default FlightDetails;
