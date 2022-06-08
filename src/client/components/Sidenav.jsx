import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGamepad,
    faCogs,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons';

import logo from '../assets/images/logo.png';

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

const Sidenav = (props) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <Nav>
            <Logo src={logo} />
            <Item
                active={pathname === '/app/controls'}
                onClick={() => navigate('controls')}
            >
                <Icon icon={faGamepad} />
                Controls
            </Item>
            <Item
                active={pathname === '/app/stats'}
                onClick={() => navigate('stats')}
            >
                <Icon icon={faChartLine} />
                Stats
            </Item>
            <Item
                active={pathname === '/app/settings'}
                onClick={() => navigate('settings')}
            >
                <Icon icon={faCogs} />
                Settings
            </Item>
        </Nav>
    );
};

export default Sidenav;
