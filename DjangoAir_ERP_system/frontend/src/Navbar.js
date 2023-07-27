import React from 'react';
import {createRoot} from 'react-dom/client';
import Registrate from './components/Registrate';
import Login from './components/Login';
import CustomerCabinetView from "./components/Customer_cabinet"
import FlightsSearch from "./components/Flight";

const Navbar = () => {
    const handleCabinetClick = () => {
        // Render the CustomerCabinetView component when the "Cabinet" button is clicked
        const container = document.getElementById('app');
        const root = createRoot(container);
        root.render(<CustomerCabinetView/>);
    };

    const handleFlightSearchClick = () => {
        const container = document.getElementById('app');
        const root = createRoot(container);
        root.render(<FlightsSearch/>)

    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
                Your Logo
            </a>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">
                            Home
                        </a>
                    </li>
                    <li className="nav-item">
                        <Registrate/>
                    </li>
                    <li className="nav-item">
                        <Login/>
                    </li>
                    <li className="nav-item">
                        {/* "Cabinet" button */}
                        <button className="nav-link" onClick={handleCabinetClick}>
                            Cabinet
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" onClick={handleFlightSearchClick}>
                            Flight Search
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;