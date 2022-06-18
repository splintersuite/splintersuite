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
                            {util.abbreviateNumber(stats?.daily?.amount)}
                        </Text>
                        <Percentage positive={stats?.daily?.change >= 0}>
                            {stats?.daily?.change >= 0 ? '+' : ''}
                            {util.toPercentage(stats?.daily?.change)}%
                        </Percentage>
                        <Indicator positive={stats?.daily?.change >= 0} />
                    </DataCard>
                    <DataCard>
                        <Label>Weekly DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(stats?.weekly?.amount)}
                        </Text>
                        <Percentage positive={stats?.weekly?.change >= 0}>
                            {stats?.weekly?.change >= 0 ? '+' : ''}
                            {util.toPercentage(stats?.weekly?.change)}%
                        </Percentage>
                        <Indicator positive={stats?.weekly?.change >= 0} />
                    </DataCard>
                    <DataCard>
                        <Label>Monthly DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(stats?.monthly?.amount)}
                        </Text>
                        <Percentage positive={stats?.monthly?.change >= 0}>
                            {stats?.monthly?.change >= 0 ? '+' : ''}
                            {util.toPercentage(stats?.monthly?.change)}%
                        </Percentage>
                        <Indicator positive={stats?.monthly?.change >= 0} />
                    </DataCard>
                </DataRow>
                <ChartCard>
                    <ChartHeader>Daily Earnings in DEC</ChartHeader>
                    <LineChart />
                </ChartCard>
            </>
        </DashboardPage>
    );
};

export default Account;
