import React from 'react';
import styled from '@emotion/styled';

import logo from '../assets/images/logo.png';

const Nav = styled.nav`
    padding: ${({ theme }) => theme.space(4)};
`;

const Navbar = (props) => {
    return (
        <Nav>
            <img src={logo} />
        </Nav>
    );
};

export default Navbar;
