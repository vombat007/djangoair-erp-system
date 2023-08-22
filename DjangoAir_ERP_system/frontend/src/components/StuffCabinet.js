import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import OptionsManagement from "./OptionsManagement";
import FlightManagement from "./FlightManagement";

function StuffCabinet() {
    const [airplanes, setAirplanes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [user_cabinet, setUserCabinet] = useState([]);


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


    return (
        <div className="container">
            <h1 className="my-4">Stuff Cabinet: {user_cabinet.role}</h1>
            <section>
                <FlightManagement userRole={user_cabinet.role} />
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
        </div>
    );
}

export default StuffCabinet;
