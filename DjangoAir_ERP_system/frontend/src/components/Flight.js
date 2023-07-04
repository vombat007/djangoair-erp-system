import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {createRoot} from "react-dom/client";

const FlightsList = () => {
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [flights, setFlights] = useState([]);

  const handleSearch = () => {
    axios
      .get('/api/flight/search/', {
        params: {
          destination: destination,
          departure_date: departureDate,
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
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="text"
        placeholder="Departure Date (YY/MM/DD)"
        value={departureDate}
        onChange={(e) => setDepartureDate(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
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
