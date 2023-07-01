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


    useEffect(() => {
        fetchCustomerData();
    }, []);


    const fetchCustomerData = async () => {
        try {
            const response = await axios.get('/api/customer_cabinet/');
            setCustomerData(response.data);
            setFirstName(response.data.user.first_name);
            setLastName(response.data.user.last_name);
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


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/customer_cabinet/', {
                first_name: firstName,
                last_name: lastName,
            }, {
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
            });

            setCustomerData(response.data);
            alert('Data updated successfully!');
        } catch (error) {
            console.error('Error updating customer data:', error);
        }
    };

    return (
        <div>
            <h1>{customerData.first_name} Cabinet</h1>
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
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
            <div>
                <h2>Discount: {customerData.discount} %</h2>
                <h2>Future Flight: {customerData.future_flight}</h2>
                <h2>Previous Flight: {customerData.previous_flight}</h2>
            </div>
        </div>
    );
};

export default CustomerCabinetView;
