import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap JS
import 'react-datepicker/dist/react-datepicker.css';
import {createRoot} from "react-dom/client";
import React from "react";

import Navbar from "./Navbar";


const container = document.getElementById('navbar');
const root = createRoot(container);
root.render(<Navbar/>);