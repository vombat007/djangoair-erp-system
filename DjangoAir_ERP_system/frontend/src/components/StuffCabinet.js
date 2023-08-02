import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StuffCabinet() {
  const [flights, setFlights] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
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
    <div>
      <h1>Stuff Cabinet</h1>

      <section>
        <h2>Flights</h2>
        <ul>
          {flights.map(flight => (
            <li key={flight.id}>
              Flight to {flight.destination} on {flight.departure_date}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Airplanes</h2>
        <ul>
          {airplanes.map(airplane => (
            <li key={airplane.id}> {airplane.id} {airplane.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Customers</h2>
        <ul>
          {customers.map(customer => (
            <li key={customer.id}>{customer.email} {customer.first_name} {customer.last_name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default StuffCabinet;