import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {createRoot} from "react-dom/client";

const FlightsList = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('/api/flights/');
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  return (
    <div>
      <h1>Flights List</h1>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            {flight.flight_number} - {flight.destination} - {flight.departure_date}
          </li>
        ))}
      </ul>
    </div>
  );
};


const container = document.getElementById('app');
const root = createRoot(container);
root.render(<FlightsList/>);
