import React from 'react';
import {createRoot} from 'react-dom/client';
import Registrate from './components/Registrate';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Registrate/>);