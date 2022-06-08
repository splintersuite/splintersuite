import React from 'react';
import { Outlet } from 'react-router-dom';

import Page from '../../components/Page.jsx';
import Sidenav from '../../components/Sidenav.jsx';

const Dashboard = () => {
    return (
        <Page>
            <Sidenav />
            <Outlet />
        </Page>
    );
};

export default Dashboard;
