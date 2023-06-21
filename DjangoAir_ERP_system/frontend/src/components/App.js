import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // Send a POST request to the registration API endpoint with the form data
    // Replace `YOUR_API_URL` with the actual URL of your backend API
    fetch('api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Handle the response from the server as needed
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle any errors that occur during the request
      });
  };

  render() {
    return (
      <div>
        <h1>User Registration</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email"
          value={this.state.email} onChange={this.handleChange} required />
          <br />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password"
          value={this.state.password} onChange={this.handleChange} required />
          <br />
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}

const container = document.getElementById('app');
render(<App />, container);
