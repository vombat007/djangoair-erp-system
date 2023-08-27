import React, {useEffect, useState} from 'react';
import axios from 'axios';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const getCSRFToken = () => {
    return getCookie('csrftoken');
};

function AirplaneForm() {
    const [formData, setFormData] = useState({
        name: '',
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/airplanes/', formData, {
            headers: {
                'X-CSRFToken': getCSRFToken(), // Include the CSRF token in the headers
            },
        })
            .then(response => {
                console.log('Airplane created successfully:', response.data);
            })
            .catch(error => {
                console.error('Error creating airplane:', error);
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
            <h2>Create Airplane</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Create Airplane</button>
            </form>
        </div>
    );
}

export default AirplaneForm;
