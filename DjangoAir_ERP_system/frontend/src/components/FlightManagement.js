import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dropdown, DropdownButton, Modal, Button} from 'react-bootstrap';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const getCSRFToken = () => {
    return getCookie('csrftoken');
};

function FlightManagement() {
    const [flights, setFlights] = useState([]);
    const [selectedFlightTickets, setSelectedFlightTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [ticketNumber, setTicketNumber] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [selectedFlightSeats, setSelectedFlightSeats] = useState({});


    useEffect(() => {
        axios.all([
            axios.get('/api/flights/'),
        ])
            .then(axios.spread((flightsResponse, airplanesResponse, customersResponse) => {
                setFlights(flightsResponse.data);
            }))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const handleFlightClick = (flightId) => {
        axios.get(`/api/ticket/${flightId}/`)
            .then(response => {
                setSelectedFlightTickets(response.data.tickets);
                setShowTicketModal(true);
            })
            .catch(error => console.error('Error fetching tickets:', error));

        axios.get(`/api/seat/${flightId}/`)
            .then(response => {
                setSelectedFlightSeats(response.data.seats);
            })
            .catch(error => console.error('Error fetching seat information:', error));
    };


    const handleCloseTicketModal = () => {
        setShowTicketModal(false);
        setSelectedTicket(null); // Reset selected ticket when closing modal
    };


    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket); // Set the selected ticket
    };

    const handleTicketNumberChange = (event) => {
        setTicketNumber(event.target.value);
    };

    const handleCheckIn = async () => {
        try {
            const response = await axios.post(
                '/api/flight/check_in/',
                {
                    ticket_number: ticketNumber,
                },
                {
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                }
            );

            setSeatNumber(response.data.seat_number);
            alert(`Checked-in! Seat Number: ${response.data.seat_number}`);
        } catch (error) {
            console.error('Error during check-in:', error);
        }
    };

    return (
        <div className="container">
            <section>
                <h2>Flights</h2>
                <ul className="list-group">
                    {flights.map(flight => (
                        <li key={flight.id} className="list-group-item">
                            Flight to {flight.destination} on {flight.departure_date}
                            <div className="custom-dropdown-container">
                                <DropdownButton
                                    variant="secondary"
                                    title="Show All Tickets"
                                    onClick={() => handleFlightClick(flight.id)}
                                    className="custom-dropdown"
                                >
                                    {selectedFlightTickets.map(ticket => (
                                        <Dropdown.Item
                                            key={ticket.id}
                                            onClick={() => handleTicketClick(ticket)} // Handle ticket click
                                        >
                                            Ticket: {ticket.ticket_number},
                                            Seat Number: {ticket.seat_number},
                                            Seat Type: {ticket.seat.seat_type}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>

                                <DropdownButton
                                    variant="secondary"
                                    title="Show Seat Information"
                                    onClick={() => handleFlightClick(flight.id)}
                                    className="custom-dropdown"
                                >
                                    {Object.entries(selectedFlightSeats).map(([seatType, seatInfo]) => (
                                        <Dropdown.Item key={seatType}>
                                            Seat class: {seatType} - Booked: {seatInfo.number_booked_seat},
                                            Free: {seatInfo.number_free_seat}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            <Modal show={selectedTicket !== null} onHide={() => setSelectedTicket(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ticket Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTicket && (
                        <div>
                            <p>Ticket: {selectedTicket.ticket_number}</p>
                            <p>First Name: {selectedTicket.user.first_name}</p>
                            <p>Last Name: {selectedTicket.user.last_name}</p>
                            <p>Email: {selectedTicket.user.email}</p>
                            <p>Gender: {selectedTicket.gender}</p>
                            <p>Seat Number: {selectedTicket.seat_number}</p>
                            <p>Seat Type: {selectedTicket.seat.seat_type}</p>
                            <p>Options:</p>
                            <ul>
                                {selectedTicket.options.map(option => (
                                    <li key={option.name}>
                                        {option.name}: {option.price}$
                                    </li>
                                ))}
                            </ul>
                            <p>Price: {selectedTicket.price}$</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="dropdown">
                        <button
                            className="btn btn-success dropdown-toggle"
                            type="button"
                            id="checkInDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Online Check-In
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="checkInDropdown">
                            <li>
                                <div className="form-group">
                                    <label htmlFor="ticketNumber">Ticket Number:</label>
                                    <input
                                        type="text"
                                        id="ticketNumber"
                                        className="form-control"
                                        value={ticketNumber}
                                        onChange={handleTicketNumberChange}
                                    />
                                </div>
                                <button onClick={handleCheckIn} className="btn btn-success">
                                    Check-In
                                </button>
                                {seatNumber && <p>Checked-In! Seat Number: {seatNumber}</p>}
                            </li>
                        </ul>
                    </div>
                    <Button variant="secondary" onClick={() => setSelectedTicket(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <style>
                {'.custom-dropdown-container {\n' +
                    '    display: flex; /* Use flexbox to display dropdowns horizontally */\n' +
                    '}\n' +
                    '\n' +
                    '.custom-dropdown {\n' +
                    '    margin-right: 10px; /* Add spacing between dropdowns if desired */\n' +
                    '}'}
            </style>
        </div>
    );
}

export default FlightManagement;
