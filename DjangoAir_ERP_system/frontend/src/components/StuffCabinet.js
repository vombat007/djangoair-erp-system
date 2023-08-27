import React, {useState, useEffect} from 'react';
import axios from 'axios';
import OptionsManagement from "./OptionsManagement";
import FlightManagement from "./FlightManagement";
import StuffManagement from "./StuffManagement";
import AirplaneForm from "./AirplaneForm";

function StuffCabinet() {
    const [airplanes, setAirplanes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [user_cabinet, setUserCabinet] = useState([]);
    const [showAirplaneForm, setShowAirplaneForm] = useState(false);

    const updateAirplanesList = (newAirplane) => {
        setAirplanes(prevAirplanes => [...prevAirplanes, newAirplane]);
    };


    useEffect(() => {
        axios.get('api/user_cabinet/')
            .then(response => setUserCabinet(response.data.user))
            .catch(error => console.error('Error fetching user cabinet', error));
        axios.all([
            axios.get('/api/flights/'),
            axios.get('/api/airplanes/'),
            axios.get('/api/customers/')
        ])
            .then(axios.spread((flightsResponse, airplanesResponse, customersResponse) => {
                setAirplanes(airplanesResponse.data);
                setCustomers(customersResponse.data);
            }))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const toggleAirplaneForm = () => {
        setShowAirplaneForm(!showAirplaneForm);
    };

    return (
        <div className="container">
            <h1 className="my-4">Stuff Cabinet: {user_cabinet.role}</h1>
            <section>
                <FlightManagement userRole={user_cabinet.role}/>
            </section>
            <section>
                <h2>Airplanes</h2>
                <ul className="list-group">
                    {airplanes.map(airplane => (
                        <li key={airplane.id} className="list-group-item">{airplane.id} Airplane
                            Type: {airplane.name}</li>
                    ))}
                </ul>
            </section>

            {showAirplaneForm && <AirplaneForm updateAirplanesList={updateAirplanesList} />}
            <section>
                <button onClick={toggleAirplaneForm}>Create Airplane</button>
            </section>

            <section>
                <h2>Customers</h2>
                <ul className="list-group">
                    {customers.map(customer => (
                        <li key={customer.id}
                            className="list-group-item">Email: {customer.email}, First Name: {customer.first_name}, Last
                            Name: {customer.last_name}</li>
                    ))}
                </ul>
            </section>

            {user_cabinet.role !== 'gate_manager' && (
                <section>
                    <OptionsManagement/>
                </section>
            )}
            <section>
                <StuffManagement/>
            </section>

        </div>
    );
}

export default StuffCabinet;
