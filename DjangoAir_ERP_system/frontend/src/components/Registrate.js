import React, {useState} from 'react';
import Form from './Form';

const Registrate = () => {
    const [showForm, setShowForm] = useState(false);
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
                new Error('Registration failed.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleShowForm = () => {
        setShowForm(true);
    };

    return (
        <div>
            <h1>Sign Up / Sign In</h1>
            {showForm ? (
                <Form
                    email={email}
                    password1={password1}
                    password2={password2}
                    errors={errors}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            ) : (
                <button type="button" className="btn btn-primary" onClick={handleShowForm}>Sign Up</button>
            )}
        </div>
    );
};

export default Registrate;
