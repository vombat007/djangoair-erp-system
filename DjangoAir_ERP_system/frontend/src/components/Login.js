import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const token = getCookie('csrftoken');
    setCsrfToken(token);

    const storedLoggedIn = localStorage.getItem('loggedIn');
    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    }
  }, []);

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
          localStorage.removeItem('loggedIn');
          localStorage.removeItem('username');
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
          <h1>Welcome, {username}!</h1>
          <button type="submit" className="btn btn-secondary" onClick={handleLogout}>
            Logout
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
