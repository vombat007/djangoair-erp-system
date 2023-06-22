import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';

const App = () => {
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password1') {
            setPassword1(e.target.value);
        } else if (e.target.name === 'password2') {
            setPassword2(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password1, password2}),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                alert('User registered successfully.');
            } else if (response.status === 400) {
                const errorData = await response.json();
                setErrors(errorData);
            } else {
                throw new Error('Registration failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle any errors that occur during the request
        }
    };

    return (
        <div>
            <h1>Sign Up / Sign In</h1>
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
                {errors.email && <p>{errors.email}</p>} {/* Display email error message */}
                <label htmlFor="password1">Password:</label>
                <input
                    type="password1"
                    id="password1"
                    name="password1"
                    value={password1}
                    onChange={handleChange}
                    required
                />
                <br/>
                <br/>
                {errors.password1 && <p>{errors.password1}</p>} {/* Display password error message */}
                <label htmlFor="password2">Repeat Password:</label>
                <input
                    type="password2"
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={handleChange}
                    required
                />
                <br/>
                {errors.password2 && <p>{errors.password2}</p>} {/* Display password error message */}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App/>);
