import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
    width: 100%;
    padding: ${({ theme }) => theme.space(4)};
    padding-left: ${({ theme }) => theme.space(12)};
    background-color: ${({ theme }) => theme.colors.grey[800]};
`;

const DashboardPage = ({ className, children }) => {
    return <Container className={className}>{children}</Container>;
};

export default DashboardPage;
