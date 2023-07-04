import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { createRoot } from 'react-dom/client';

const FlightsList = () => {
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [flights, setFlights] = useState([]);

  const handleSearch = () => {
    axios
      .get('/api/flight/search/', {
        params: {
          destination: destination,
          departure_date: departureDate.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
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
        className="form-control"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <DatePicker
        selected={departureDate}
        onChange={(date) => setDepartureDate(date)}
        dateFormat="yyyy-MM-dd"
        className="form-control"
        placeholderText="Departure Date (YY-MM-DD)"
      />
        <div>
            <button type="submit" className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
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
root.render(<FlightsList />);
