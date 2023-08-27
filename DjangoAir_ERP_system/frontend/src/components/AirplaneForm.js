import React, {useState} from 'react';
import axios from 'axios';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const getCSRFToken = () => {
    return getCookie('csrftoken');
};

function AirplaneForm({updateAirplanesList}) {
    const [formData, setFormData] = useState({
        name: '',
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/airplanes/', formData, {
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
        })
            .then(response => {
                console.log('Airplane created successfully:', response.data);
                // Call the updateAirplanesList function to update the list
                updateAirplanesList(response.data);
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
            <div className="dropdown">
                <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    id="createAirplaneDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Create Airplane
                </button>
                <div className="dropdown-menu" aria-labelledby="createAirplaneDropdown">
                    <h2>Create Airplane</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Create Airplane
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AirplaneForm;
