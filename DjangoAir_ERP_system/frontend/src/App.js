import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send a POST request to the registration API endpoint with the form data
        fetch('api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
            .then((response) => {
                if (response.ok) {
                    // User registered successfully
                    return response.json().then((data) => {
                        console.log(data);
                        // Display the success message
                        alert('User registered successfully.');
                    });
                } else {
                    // Registration failed, handle the error
                    throw new Error('Registration failed.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors that occur during the request
            });
    };

    return (
        <div>
            <h1>Sing Up / Sing In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                />
                <br/>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                />
                <br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App tab="home"/>);
