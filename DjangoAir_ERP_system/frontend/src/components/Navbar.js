import React, {useState} from 'react';
import Registrate from './Registrate';
import Login from './Login';
import CustomerCabinetView from "./CustomerCabinet"
import FlightsSearch from "./Flight";


const Navbar = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    const handleCabinetClick = () => {
        setActiveComponent('Cabinet');
    };

    const handleFlightSearchClick = () => {
        setActiveComponent('FlightSearch');
    }

    // Helper function to render the appropriate component based on activeComponent
    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'Cabinet':
                return <CustomerCabinetView/>;
            case 'FlightSearch':
                return <FlightsSearch/>;
            default:
                return <FlightsSearch/>;
        }
    };

    return (
        <div>
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
                        <li className="nav-item">
                            <Registrate/>
                        </li>
                        <li className="nav-item">
                            <Login/>
                        </li>
                    </ul>
                </div>
            </nav>
            {renderActiveComponent()}

        </div>
    );
};

export default Navbar;