import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Form} from 'react-bootstrap';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const getCSRFToken = () => {
    return getCookie('csrftoken');
};

function FlightForm({ updateFlightsList }) {
    const [formData, setFormData] = useState({
        airplane: '',
        departure_date: '',
        destination: '',
    });

    const [airplanes, setAirplanes] = useState([]);

    useEffect(() => {
        axios.get('/api/airplanes/')
            .then(response => {
                setAirplanes(response.data);
            })
            .catch(error => {
                console.error('Error fetching airplanes:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedAirplane = airplanes.find(airplane => airplane.name === formData.airplane);
        const formattedDepartureDate = new Date(formData.departure_date).toISOString();
        const payload = {
            airplane: selectedAirplane.id, // Send the airplane ID
            departure_date: formattedDepartureDate,
            destination: formData.destination,
        };

        axios.post('/api/flights/', payload, {
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
        })
            .then(response => {
                console.log('Flight created successfully:', response.data);
                updateFlightsList(prevFlights => [...prevFlights, response.data]);
            })
            .catch(error => {
                console.error('Error creating flight:', error);
            });
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="container">
            <div className="dropdown">
                <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    id="createFlightDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Create Flight
                </button>
                <div className="dropdown-menu" aria-labelledby="createFlightDropdown">
                    <h2>Create Flight</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Airplane:</label>
                            <Form.Control
                                as="select"
                                name="airplane"
                                value={formData.airplane}
                                onChange={handleInputChange}
                            >
                                <option value="">Select an airplane</option>
                                {airplanes.map(airplane => (
                                    <option key={airplane.id} value={airplane.name}>
                                        {airplane.name}
                                    </option>
                                ))}
                            </Form.Control>
                            <label>Departure Date/Time:</label>
                            <Form.Control
                                type="datetime-local"
                                name="departure_date"
                                value={formData.departure_date}
                                onChange={handleInputChange}
                            />
                            <label>Destination:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="destination"
                                value={formData.destination}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Create Flight
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FlightForm;
