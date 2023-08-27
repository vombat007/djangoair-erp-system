import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function StuffManagement() {
    const [staffData, setStaffData] = useState({
        gate_manager: [],
        check_in_manager: [],
        supervisor: [],
    });

    useEffect(() => {
        // Fetch staff data from the API endpoint
        axios.get('/api/stuff/')
            .then(response => {
                setStaffData(response.data);
            })
            .catch(error => {
                console.error('Error fetching staff data:', error);
            });
    }, []);

    return (
        <div className="container">
            <h1>Stuff List:</h1>
            <section>
                <h2>Gate Managers</h2>
                <ul className="list-group">
                    {staffData.gate_manager.map(manager => (
                        <li key={manager.id}
                            className="list-group-item">Email: {manager.email}, First Name: {manager.first_name},Last
                            Name: {manager.last_name}</li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Check-in Managers</h2>
                <ul className="list-group">
                    {staffData.check_in_manager.map(manager => (
                        <li key={manager.id}
                            className="list-group-item">Email: {manager.email}, First Name: {manager.first_name},Last
                            Name: {manager.last_name}</li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Supervisors</h2>
                <ul className="list-group">
                    {staffData.supervisor.map(manager => (
                        <li key={manager.id}
                            className="list-group-item">Email: {manager.email}, First Name: {manager.first_name},Last
                            Name: {manager.last_name}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default StuffManagement;
