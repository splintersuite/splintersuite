import React from 'react';
import styled from '@emotion/styled';
import { Button, Input } from '@mantine/core';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';

const Data = styled.h1`
    font-size: 48px;
`;

const Change = styled.span`
    font-size: 24px;
    color: ${({ theme }) => theme.colors.success};
`;

const Stats = () => {
    return (
        <DashboardPage>
            <h1>Stats</h1>

            <Label>
                <Text>Daily Earnings</Text>
                <Data>123 DEC</Data>
                <Change>+24.13%</Change>
            </Label>

            <Label>
                <Text>Weekly Earnings</Text>
                <Data>123 DEC</Data>
                <Change>+24.13%</Change>
            </Label>

            <Label>
                <Text>Monthly Earnings</Text>
                <Data>123 DEC</Data>
                <Change>+24.13%</Change>
            </Label>
        </DashboardPage>
    );
};

export default Stats;
