import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dropdown, DropdownButton} from 'react-bootstrap';

function StuffCabinet() {
    const [flights, setFlights] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [user_cabinet, setUserCabinet] = useState([]);
    const [selectedFlightTickets, setSelectedFlightTickets] = useState([]); // State for ticket information


    useEffect(() => {
        axios.get('api/user_cabinet/')
            .then(response => setUserCabinet(response.data.user))
            .catch(error => console.error('Error fetching user cabinet', error));
        // Fetch Flights, Airplanes, and Customers
        axios.all([
            axios.get('/api/flights/'),
            axios.get('/api/airplanes/'),
            axios.get('/api/customers/')
        ])
            .then(axios.spread((flightsResponse, airplanesResponse, customersResponse) => {
                setFlights(flightsResponse.data);
                setAirplanes(airplanesResponse.data);
                setCustomers(customersResponse.data);
            }))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleFlightClick = (flightId) => {
        axios.get(`/api/ticket/${flightId}/`)
            .then(response => {
                setSelectedFlightTickets(response.data.tickets); // Update ticket information state
            })
            .catch(error => console.error('Error fetching tickets:', error));
    };


    return (
        <div className="container">
            <h1 className="my-4">Stuff Cabinet {user_cabinet.role}</h1>

            <section>
                <h2>Flights</h2>
                <ul className="list-group">
                    {flights.map(flight => (
                        <li key={flight.id} className="list-group-item">
                            Flight to {flight.destination} on {flight.departure_date}
                            <DropdownButton
                                variant="secondary"
                                title="Show All Tickets"
                                onClick={() => handleFlightClick(flight.id)}
                                className="custom-dropdown"
                            >
                                {selectedFlightTickets.map(ticket => (
                                    <Dropdown.Item key={ticket.id}>
                                        Ticket: {ticket.ticket_number},
                                        First Name: {ticket.user.first_name},
                                        Last Name: {ticket.user.last_name},
                                        Email: {ticket.user.email},
                                        Gender: {ticket.gender},
                                        Seat Number: {ticket.seat_number},
                                        Seat Type: {ticket.seat.seat_type},
                                        Price: {ticket.price},
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Airplanes</h2>
                <ul className="list-group">
                    {airplanes.map(airplane => (
                        <li key={airplane.id} className="list-group-item">{airplane.id} {airplane.name}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Customers</h2>
                <ul className="list-group">
                    {customers.map(customer => (
                        <li key={customer.id}
                            className="list-group-item">{customer.email} {customer.first_name} {customer.last_name}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default StuffCabinet;
