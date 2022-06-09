import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRobot,
    faUserNinja,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mantine/core';

import logo from '../assets/images/logo.png';
import { useUser } from '../contexts/UserContext.jsx';

const Nav = styled.nav`
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    width: 256px;
    padding-top: ${({ theme }) => theme.space(4)};
    padding-bottom: ${({ theme }) => theme.space(4)};
`;

const Logo = styled.img`
    padding-right: ${({ theme }) => theme.space(4)};
    padding-left: ${({ theme }) => theme.space(4)};
    margin-bottom: ${({ theme }) => theme.space(12)};
`;

const Item = styled.div`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.space(4)};
    font-size: 20px;
    font-weight: bold;
    opacity: ${({ active }) => (active ? 1 : 0.8)};
    background: ${({ theme, active }) =>
        active ? theme.colors.grey[800] : 'transparent'};
    transition: ${({ theme }) => theme.transition};

    &:hover {
        background: ${({ theme }) => theme.colors.grey[800]};
        cursor: pointer;
        opacity: 1;
    }
`;

const Icon = styled(FontAwesomeIcon)`
    font-size: 20px;
    margin-right: ${({ theme }) => theme.space(2)};
`;

const LogoutButton = styled(Button)`
    margin-top: auto;
    margin-right: ${({ theme }) => theme.space(4)};
    margin-left: ${({ theme }) => theme.space(4)};
    background: ${({ theme }) => theme.colors.grey[800]};
`;

const Sidenav = (props) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { username, handleLogout } = useUser();

    const handleLogoutClick = () => {
        handleLogout();
    };

    const handleNavigateClick = (route) => {
        if (!username && route !== 'account') {
        } else {
            navigate(route);
            // prevent navigation when not logged in
        }
    };

    return (
        <Nav>
            <Logo src={logo} />
            <Item
                active={pathname === '/app/settings'}
                onClick={() => handleNavigateClick('settings')}
            >
                <Icon icon={faRobot} />
                Settings
            </Item>
            <Item
                active={pathname === '/app/stats'}
                onClick={() => handleNavigateClick('stats')}
            >
                <Icon icon={faChartLine} />
                Stats
            </Item>
            <Item
                active={pathname === '/app/account'}
                onClick={() => handleNavigateClick('account')}
            >
                <Icon icon={faUserNinja} />
                Account
            </Item>

            {username && (
                <LogoutButton onClick={handleLogoutClick}>Logout</LogoutButton>
            )}
        </Nav>
    );
};

export default Sidenav;
