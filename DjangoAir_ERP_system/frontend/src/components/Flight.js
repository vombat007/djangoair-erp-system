import React, {useState} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import {createRoot} from 'react-dom/client';
import {Form, Button} from 'react-bootstrap';

const FlightsList = () => {
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [seatCount, setSeatCount] = useState('');
    const [flights, setFlights] = useState([]);

    const handleSearch = () => {
        if (!destination || Number(destination)) {
            alert('Please enter a valid destination');
            return;
        }

        if (!seatCount || isNaN(Number(seatCount)) || Number(seatCount) < 0) {
            alert('Please enter a valid seat count.');
            return;
        }

        axios
            .get('/api/flight/search/', {
                params: {
                    destination: destination,
                    departure_date: departureDate.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
                    seats_count: seatCount,
                },
            })
            .then((response) => {
                setFlights(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Flight Search</h1>
            <Form.Group controlId="destination">
                <Form.Control
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="seatCount">
                <Form.Label>Seat Count</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Seat Count"
                    value={seatCount}
                    onChange={(e) => setSeatCount(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="departureDate">
                <Form.Label>Departure Date</Form.Label>
                <br/>
                <DatePicker
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    placeholderText="Departure Date (YY-MM-DD)"
                />
            </Form.Group>
            <Button variant="primary" onClick={handleSearch}>
                Search
            </Button>
            <div>
                {flights.map((flight) => (
                    <div key={flight.id}>
                        <p>Destination: {flight.destination}</p>
                        <p>Departure Date: {flight.departure_date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<FlightsList/>);
