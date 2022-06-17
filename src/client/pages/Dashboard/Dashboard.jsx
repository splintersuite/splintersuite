import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Page from '../../components/Page.jsx';
import Sidenav from '../../components/Sidenav.jsx';
import Footer from '../../components/Footer.jsx';
import { useUser } from '../../contexts/UserContext.jsx';

const Dashboard = () => {
    const { getUser } = useUser();

    useEffect(() => {
        getUser();
    }, []);

    return (
        <Page>
            <Sidenav />
            <Outlet />
            <Footer />
        </Page>
    );
};

export default Dashboard;
