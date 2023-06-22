import React from 'react';

const Form = ({ email, password1, password2, errors, handleChange, handleSubmit }) => {
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

export default Form;
