import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
    width: 100%;
    margin-left: 256px; // sidenav width
    padding: ${({ theme }) => theme.space(8)};
    padding-bottom: 256px;
    background-color: ${({ theme }) => theme.colors.grey[800]};
`;

const DashboardPage = ({ className, children }) => {
    return <Container className={className}>{children}</Container>;
};

export default DashboardPage;
