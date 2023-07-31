import React, { useState, useEffect } from 'react';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function Login({ onLoginStatusChange }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const token = getCookie('csrftoken');
    setCsrfToken(token);

    // Check if user was logged in before page reload
    const storedLoggedIn = localStorage.getItem('loggedIn');
    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
      onLoginStatusChange(true); // Notify Navbar about the login status change
    }
  }, [onLoginStatusChange]);

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleLogin = () => {
    fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.status === 202) {
          setLoggedIn(true);
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', username);
          onLoginStatusChange(true);
        } else {
          // Handle invalid username or password
        }
      })
      .catch((error) => {
        // Handle network or server errors
      });
  };

  const handleLogout = () => {
    fetch('/api/logout/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setLoggedIn(false);
          localStorage.removeItem('loggedIn'); // Remove login status from local storage
          localStorage.removeItem('username');
          onLoginStatusChange(false); // Notify Navbar about the login status change
        } else {
          // Handle logout failure
        }
      })
      .catch((error) => {
        // Handle network or server errors
      });
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <button type="submit" className="btn btn-secondary" onClick={handleLogout}>
            {username} Logout
          </button>
        </div>
      ) : (
        <div>
          {!showLoginForm && (
            <button type="submit" className="btn btn-primary" onClick={handleLoginClick}>
              Login
            </button>
          )}
          {showLoginForm && (
            <div>
              <input
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
