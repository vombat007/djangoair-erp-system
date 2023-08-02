import React, {useState} from 'react';
import Registrate from './Registrate';
import Login from './Login';
import CustomerCabinetView from "./CustomerCabinet";
import FlightsSearch from "./Flight";
import StuffCabinet from "./StuffCabinet";

const Navbar = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const handleCabinetClick = () => {
        setActiveComponent('Cabinet');
    };

    const handleFlightSearchClick = () => {
        setActiveComponent('FlightSearch');
    };

    const handleLoginStatusChange = (isLoggedIn) => {
        setLoggedIn(isLoggedIn);
    };

    const handleStuffCabinetClick = () => {
        setActiveComponent('StuffCabinet')
    };

    // Helper function to render the appropriate component based on activeComponent
    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'Cabinet':
                return <CustomerCabinetView/>;
            case 'FlightSearch':
                return <FlightsSearch/>;
            case 'StuffCabinet':
                return <StuffCabinet/>;

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

                        {loggedIn && (
                            <li className="nav-item">
                                <button className="nav-link" onClick={handleCabinetClick}>
                                    Cabinet
                                </button>
                            </li>
                        )}
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleStuffCabinetClick}>
                                Stuff Cabinet
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
                            <Login onLoginStatusChange={handleLoginStatusChange}/>
                        </li>
                    </ul>
                </div>
            </nav>
            {renderActiveComponent()}
        </div>
    );
};

export default Navbar;
