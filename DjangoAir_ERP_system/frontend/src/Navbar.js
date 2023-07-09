import React from 'react';
import {createRoot} from 'react-dom/client';
import Registrate from './components/Registrate';
import Login from './components/Login';
import CustomerCabinetView from "./components/Customer_cabinet";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
                Your Logo
            </a>
            {/* ...existing code for the navbar */}
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">
                            Home
                        </a>
                    </li>

                    <li className="nav-item">
                        <Registrate />
                    </li>
                    <li className="nav-item">
                        <Login />
                    </li>
                  <li className="nav-item">
                        <CustomerCabinetView />
                    </li>
                </ul>
            </div>
        </nav>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Navbar/>);