import React, {useState, useEffect} from 'react';
import axios from 'axios';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const getCSRFToken = () => {
    return getCookie('csrftoken');
};

const CustomerCabinetView = () => {
    const [customerData, setCustomerData] = useState({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ticketNumber, setTicketNumber] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [futureFlights, setFutureFlights] = useState([]);
    const [pastFlights, setPastFlights] = useState([]);

    useEffect(() => {
        fetchCustomerData();
    }, []);

    const fetchCustomerData = async () => {
        try {
            const response = await axios.get('/api/user_cabinet/');
            setCustomerData(response.data.customer_cabinet);
            setFirstName(response.data.customer_cabinet.first_name || '');
            setLastName(response.data.customer_cabinet.last_name || '');
            setFutureFlights(response.data.future_flight || []);
            setPastFlights(response.data.past_flight || []);
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleTicketNumberChange = (event) => {
        setTicketNumber(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                '/api/user_cabinet/',
                {
                    first_name: firstName,
                    last_name: lastName,
                },
                {
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                }
            );

            setCustomerData(response.data);
            alert('Data updated successfully!');
        } catch (error) {
            console.error('Error updating customer data:', error);
        }
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
        <div>
            <h1>{customerData.first_name} Cabinet</h1>
            <div>
                <h2>Discount: {customerData.discount} %</h2>
            </div>

            <div className="dropdown">
                <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    id="updateDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Change First and Last Name
                </button>
                <ul className="dropdown-menu" aria-labelledby="updateDropdown">
                    <li>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name:</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="form-control"
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name:</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="form-control"
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Update
                            </button>
                        </form>
                    </li>
                </ul>
            </div>

            <hr/>

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

            <div className="dropdown">
                <button
                    className="btn btn-info dropdown-toggle"
                    type="button"
                    id="futureFlightsDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Future Flights
                </button>
                <ul className="dropdown-menu" aria-labelledby="futureFlightsDropdown">
                    <li>
                        <ul>
                            {futureFlights.map((flight) => (
                                <li key={flight.id}>
                                    Ticket Number: {flight.ticket_number}, Departure Date: {flight.departure_date}, Seat
                                    Number: {flight.seat_number}
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </div>

            <div className="dropdown">
                <button
                    className="btn btn-warning dropdown-toggle"
                    type="button"
                    id="pastFlightsDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Past Flights
                </button>
                <ul className="dropdown-menu" aria-labelledby="pastFlightsDropdown">
                    <li>
                        <ul>
                            {pastFlights.map((flight) => (
                                <li key={flight.id}>
                                    Ticket Number: {flight.ticket_number}, Departure Date: {flight.departure_date}, Seat
                                    Number: {flight.seat_number}
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </div>

            <style>
                {`
          .form-control {
            width: 700px; /* Set the desired width for the input fields */
          }
        `}
            </style>
        </div>
    );
};

export default CustomerCabinetView;