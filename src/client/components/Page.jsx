import React from 'react';
import styled from '@emotion/styled';

import Navbar from './Navbar.jsx';

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.grey[900]};
`;

const Page = ({ className, children }) => {
    return (
        <Container className={className}>
            {/* <Navbar /> */}
            {children}
        </Container>
    );
};

export default Page;
