import React from 'react';

const Form = ({ email, password1, password2, errors, handleChange, handleSubmit }) => {
    return (
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
            {errors.email && <p>{errors.email}</p>}

            <label htmlFor="password1">Password:</label>
            <input
                type="password"
                id="password1"
                name="password1"
                value={password1}
                onChange={handleChange}
                required
            />
            <br/>
            <br/>
            {errors.password1 && <p>{errors.password1}</p>}

            <label htmlFor="password2">Repeat Password:</label>
            <input
                type="password"
                id="password2"
                name="password2"
                value={password2}
                onChange={handleChange}
                required
            />
            <br/>
            {errors.password2 && <p>{errors.password2}</p>}

            <button type="submit">Sing Up</button>
        </form>
    );
};

export default Form;
