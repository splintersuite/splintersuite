import React from 'react';
import {
    MemoryRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Loading from '../pages/Loading.jsx';
import Landing from '../pages/Landing.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import DashboardSettings from '../pages/Dashboard/Settings.jsx';
import DashboardStats from '../pages/Dashboard/Stats.jsx';
import DashboardAccount from '../pages/Dashboard/Account.jsx';
import DashboardBilling from '../pages/Dashboard/Billing.jsx';

const RoutesContainer = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Loading />} />
                <Route path="/home" element={<Landing />} />
                <Route path="/app" element={<Dashboard />}>
                    <Route
                        path="/app"
                        element={<Navigate to={`/app/account`} />}
                    />
                    <Route path="/app/account" element={<DashboardAccount />} />
                    <Route
                        path="/app/settings"
                        element={<DashboardSettings />}
                    />
                    <Route path="/app/billing" element={<DashboardBilling />} />
                    {/* <Route path="/app/stats" element={<DashboardStats />} /> */}
                </Route>
            </Routes>
        </Router>
    );
};

export default RoutesContainer;
