import React, {useState} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import {createRoot} from 'react-dom/client';
import {Form, Button} from 'react-bootstrap';
import FlightDetails from './FlightDetails';

const FlightsSearch = () => {
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [seatCount, setSeatCount] = useState('');
    const [flights, setFlights] = useState([]);
    const [showNoFlightsMessage, setShowNoFlightsMessage] = useState(false);
    const [selectedFlightId, setSelectedFlightId] = useState(null); // Track the selected flight ID
    const [showSeatTypeOptions, setShowSeatTypeOptions] = useState(false); // Flag to show/hide seat type options

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
                setShowNoFlightsMessage(response.data.length === 0); // Set the flag based on the response
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleNextStep = (flightId) => {
        // Set the selected flight ID and show seat type options
        setSelectedFlightId(flightId);
        setShowSeatTypeOptions(true);
    };

    const handleBack = () => {
        // Reset the selected flight ID and hide seat type options
        setSelectedFlightId(null);
        setShowSeatTypeOptions(false);
    };

    return (
        <div>
            {showSeatTypeOptions ? (
                <FlightDetails flightId={selectedFlightId} handleBack={handleBack}/>
            ) : (
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
                    {showNoFlightsMessage ? (
                        <p>No flights available for the given criteria. Please choose a different date or
                            destination.</p>
                    ) : (
                        <div>
                            {flights.map((flight) => (
                                <div key={flight.flight_id}>
                                    <p>Destination: {flight.destination}</p>
                                    <p>Departure Date: {flight.departure_date}</p>
                                    <Button variant="info" onClick={() => handleNextStep(flight.flight_id)}>
                                        Next Step
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<FlightsSearch/>);
