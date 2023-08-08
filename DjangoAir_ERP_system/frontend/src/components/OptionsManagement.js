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

const OptionsManagement = () => {
    const [options, setOptions] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch existing options when the component mounts
    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const response = await axios.get('/api/options/');
            setOptions(response.data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/options/', {
                    name: name,
                    price: price

                },
                {
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                });

            // Handle successful creation
            console.log('Option created:', response.data);

            // Clear form fields
            setName('');
            setPrice('');
            setErrorMessage('');

            // Refresh options
            fetchOptions();
        } catch (error) {
            // Handle error
            if (error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('An error occurred while creating the option.');
            }
        }
    };

    return (
        <div className="container">
            <h2 className="mt-4">Existing Options</h2>
            <ul>
                {options.map(option => (
                    <li key={option.id}>
                        Name: {option.name}, Price: {option.price}$
                    </li>
                ))}
            </ul>
            <h1 className="mt-4">Option Create</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price:</label>
                    <input
                        type="number"
                        id="price"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Option</button>
                {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
            </form>

        </div>
    );
};

export default OptionsManagement;
