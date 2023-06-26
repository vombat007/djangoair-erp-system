import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';

const Form = ({email, password1, password2, errors, handleChange, handleSubmit}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="password1">Password:</label>
                <input
                    type="password"
                    id="password1"
                    name="password1"
                    value={password1}
                    onChange={handleChange}
                    required
                    className={`form-control ${errors.password1 ? 'is-invalid' : ''}`}
                />
                {errors.password1 && <div className="invalid-feedback">{errors.password1}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="password2">Repeat Password:</label>
                <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={handleChange}
                    required
                    className={`form-control ${errors.password2 ? 'is-invalid' : ''}`}
                />
                {errors.password2 && <div className="invalid-feedback">{errors.password2}</div>}
            </div>

            <button type="submit" className="btn btn-primary">Register</button>
        </form>
    );
};

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
