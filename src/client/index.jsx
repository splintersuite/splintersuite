import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './components/App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Dev Mode
// root.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );
