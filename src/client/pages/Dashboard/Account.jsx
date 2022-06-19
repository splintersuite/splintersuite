import React from 'react';
import styled from '@emotion/styled';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import Card from '../../components/Card.jsx';
import Col from '../../components/Col.jsx';
import Row from '../../components/Row.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';
import LineChart from '../../components/LineChart.jsx';
import { useUser } from '../../contexts/UserContext.jsx';
import util from '../../util';

const UserCol = styled(Col)`
    margin-right: auto;
`;

const StatCol = styled(Col)`
    align-items: flex-end;
    margin-left: ${({ theme }) => theme.space(4)};
`;

const DataRow = styled(Row)`
    justify-content: space-between;
`;

const DataCard = styled(Card)`
    position: relative;
    width: calc(33% - 21px);
    overflow: hidden;
`;

const Percentage = styled.span`
    color: ${({ theme, positive }) =>
        positive ? theme.colors.success : theme.colors.error};
`;

const Indicator = styled.span`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 16px;
    background: ${({ theme, positive }) =>
        positive ? theme.colors.success : theme.colors.error};
`;

const DEC = styled.span`
    margin-left: ${({ theme }) => theme.space(1)};
    font-size: 24px;
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.8;
`;

const ChartCard = styled(Card)`
    width: 100%;
`;

const ChartHeader = styled.h2`
    margin-bottom: ${({ theme }) => theme.space(4)};
`;

const Account = () => {
    const { user, username } = useUser();
    const { stats } = user;

    const daily = {
        amount: stats?.earnings?.daily?.amount || 0,
        change: stats?.earnings?.daily?.change || 0,
    };

    const weekly = {
        amount: stats?.earnings?.wtdEearnings?.amount || 0,
        change: stats?.earnings?.wtdEearnings?.change || 0,
    };

    const monthly = {
        amount: stats?.earnings?.mtdEearnings?.amount || 0,
        change: stats?.earnings?.mtdEearnings?.change || 0,
    };

    return (
        <DashboardPage>
            <>
                <Card>
                    <Row>
                        <UserCol>
                            <Label>Welcome back,</Label>
                            <Text size="32px" weight="bold">
                                {username}
                            </Text>
                        </UserCol>
                        <StatCol>
                            <Label>DEC</Label>
                            <Text size="32px">
                                {util.separateNumber(user?.balances?.dec)}
                            </Text>
                        </StatCol>
                        <StatCol>
                            <Label>SPS</Label>
                            <Text size="32px">
                                {util.separateNumber(user?.balances?.sps)}
                            </Text>
                        </StatCol>
                        <StatCol>
                            <Label>RC</Label>
                            <Text size="32px">{user?.balances?.rc}%</Text>
                        </StatCol>
                    </Row>
                </Card>
                <DataRow>
                    <DataCard>
                        <Label>Daily DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(daily.amount)}
                        </Text>
                        <Percentage positive={daily.change >= 0}>
                            {daily.change >= 0 ? '+' : ''}
                            {util.toPercentage(daily.change)}%
                        </Percentage>
                        <Indicator positive={daily.change >= 0} />
                    </DataCard>
                    <DataCard>
                        <Label>Weekly DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(weekly.amount)}
                        </Text>
                        <Percentage positive={weekly.change >= 0}>
                            {weekly.change >= 0 ? '+' : ''}
                            {util.toPercentage(weekly.change)}%
                        </Percentage>
                        <Indicator positive={weekly.change >= 0} />
                    </DataCard>
                    <DataCard>
                        <Label>Monthly DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(monthly.amount)}
                        </Text>
                        <Percentage positive={monthly.change >= 0}>
                            {monthly.change >= 0 ? '+' : ''}
                            {util.toPercentage(monthly.change)}%
                        </Percentage>
                        <Indicator positive={monthly.change >= 0} />
                    </DataCard>
                </DataRow>
                <ChartCard>
                    <ChartHeader>Daily Earnings in DEC</ChartHeader>
                    <LineChart data={stats.weekly} />
                </ChartCard>
            </>
        </DashboardPage>
    );
};

export default Account;
