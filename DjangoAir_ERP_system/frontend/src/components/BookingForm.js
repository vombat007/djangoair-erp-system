import React, {useState} from 'react';
import axios from 'axios';
import {Button, Form} from 'react-bootstrap';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const getCSRFToken = () => {
    return getCookie('csrftoken');
};

const BookingForm = ({
                         flightId,
                         selectedSeat,
                         selectedOptions,
                         totalPrice,
                         onBack // Add onBack prop to handle back button click
                     }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [passportNumber, setPassportNumber] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Prepare the data for API request
        const requestData = {
            flight_id: flightId,
            seat_id: selectedSeat.id,
            price: totalPrice,
            option_ids: selectedOptions.map((option) => option.id),
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            passport_number: passportNumber,
        };

        // Make API request to BookingFlightAPIView
        axios
            .post('/api/flight/booking/', requestData, {
                headers: {
                    'X-CSRFToken': getCSRFToken(), // Add the CSRF token to the headers
                },
            })
            .then((response) => {
                // Handle successful booking
                console.log('Booking successful:', response.data);
                // Reset the form fields
                setFirstName('');
                setLastName('');
                setGender('');
                setPassportNumber('');
            })
            .catch((error) => {
                // Handle booking error
                console.error('Booking error:', error);
            });
    };

    return (
        <div>
            <h2>Booking Details</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                        as="select"
                        value={gender}
                        onChange={(event) => setGender(event.target.value)}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="passportNumber">
                    <Form.Label>Passport Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={passportNumber}
                        onChange={(event) => setPassportNumber(event.target.value)}
                        required
                    />
                </Form.Group>

                <p>Total Price: {totalPrice}</p>

                {/* Add back button */}
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>

                <Button variant="primary" type="submit">
                    Book Flight
                </Button>
            </Form>
        </div>
    );
};

export default BookingForm;
