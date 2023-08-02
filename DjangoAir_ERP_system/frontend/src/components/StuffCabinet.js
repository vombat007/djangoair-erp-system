import React, {useState, useEffect} from 'react';
import axios from 'axios';

function StuffCabinet() {
    const [flights, setFlights] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [user_cabinet, setUserCabinet] = useState([]);

    useEffect(() => {
        axios.get('api/user_cabinet/')
            .then(response => setUserCabinet(response.data.user))
            .catch(error => console.error('Error fetching user cabinet', error));
        // Fetch Flights
        axios.get('/api/flights/')
            .then(response => setFlights(response.data))
            .catch(error => console.error('Error fetching flights:', error));

        // Fetch Airplanes
        axios.get('/api/airplanes/')
            .then(response => setAirplanes(response.data))
            .catch(error => console.error('Error fetching airplanes:', error));

        // Fetch Customers
        axios.get('/api/customers/')
            .then(response => setCustomers(response.data))
            .catch(error => console.error('Error fetching customers:', error));
    }, []);

    return (
        <div className="container">
            <h1 className="my-4">Stuff Cabinet {user_cabinet.role}</h1>

            <section>
                <h2>Flights</h2>
                <ul className="list-group">
                    {flights.map(flight => (
                        <li key={flight.id} className="list-group-item">
                            Flight to {flight.destination} on {flight.departure_date}
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
