import React from 'react';
import {
    MemoryRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Landing from '../pages/Landing.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import DashboardControls from '../pages/Dashboard/Controls.jsx';
import DashboardStats from '../pages/Dashboard/Stats.jsx';
import DashboardSettings from '../pages/Dashboard/Settings.jsx';

const RoutesContainer = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Landing />} />
                <Route path="/" element={<Navigate to="/app" />} />
                <Route path="/app" element={<Dashboard />}>
                    <Route
                        path="/app"
                        element={<Navigate to="/app/controls" />}
                    />
                    <Route
                        path="/app/controls"
                        element={<DashboardControls />}
                    />
                    <Route path="/app/stats" element={<DashboardStats />} />
                    <Route
                        path="/app/settings"
                        element={<DashboardSettings />}
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default RoutesContainer;
