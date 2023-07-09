import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlightDetails = ({ flightId, setShowSeatTypeOptions }) => {
  const [seatTypes, setSeatTypes] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get('/api/flight/options/', {
        params: {
          flight_id: flightId,
        },
      })
      .then((response) => {
        setSeatTypes(response.data.seat_types);
        setOptions(response.data.options);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [flightId]);

  const handleBack = () => {
    setShowSeatTypeOptions(false); // Hide seat type options
  };

  return (
    <div>
      <h2>Seat Type Options</h2>
      <p>Flight ID: {flightId}</p>
      <button type="button" class="btn btn-secondary"  onClick={handleBack}>Back</button>
      {/* Render the seat types and options */}
      <h3>Seat Types</h3>
      <ul>
        {seatTypes.map((seatType) => (
          <li key={seatType.id}>{seatType.seat_type} Quantity of seats {seatType.quantity}</li>
        ))}
      </ul>
      <h3>Options</h3>
      <ul>
        {options.map((option) => (
          <li key={option.id}>{option.name} Price {option.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default FlightDetails;
