import React from 'react';
import { Outlet } from 'react-router-dom';

import Page from '../../components/Page.jsx';
import Sidenav from '../../components/Sidenav.jsx';
import Footer from '../../components/Footer.jsx';

const Dashboard = () => {
    return (
        <Page>
            <Sidenav />
            <Outlet />
            <Footer />
        </Page>
    );
};

export default Dashboard;
