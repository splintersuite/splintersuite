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

    const bot = {
        daily: {
            amount: stats?.bot?.daily?.amount || 0,
            change: stats?.bot?.daily?.change || 0,
        },
        weekly: {
            amount: stats?.bot?.wtd?.amount || 0,
            change: stats?.bot?.wtd?.change || 0,
        },

        monthly: {
            amount: stats?.bot?.mtd?.amount || 0,
            change: stats?.bot?.mtd?.change || 0,
        },
    };

    const total = {
        daily: {
            amount: stats?.total?.daily?.amount || 0,
            change: stats?.total?.daily?.change || 0,
        },
        weekly: {
            amount: stats?.total?.wtd?.amount || 0,
            change: stats?.total?.wtd?.change || 0,
        },

        monthly: {
            amount: stats?.total?.mtd?.amount || 0,
            change: stats?.total?.mtd?.change || 0,
        },
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
                        <Label>Total Daily DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(total.daily.amount)}
                        </Text>
                        <Percentage positive={total.daily.change >= 0}>
                            {total.daily.change >= 0 ? '+' : ''}
                            {util.toPercentage(total.daily.change)}%
                        </Percentage>
                        <Indicator positive={total.daily.change >= 0} />
                    </DataCard>
                    <DataCard>
                        <Label>Total Weekly DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(total.weekly.amount)}
                        </Text>
                        <Percentage positive={total.weekly.change >= 0}>
                            {total.weekly.change >= 0 ? '+' : ''}
                            {util.toPercentage(total.weekly.change)}%
                        </Percentage>
                        <Indicator positive={total.weekly.change >= 0} />
                    </DataCard>
                    <DataCard>
                        <Label>Total Monthly DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(total.monthly.amount)}
                        </Text>
                        <Percentage positive={total.monthly.change >= 0}>
                            {total.monthly.change >= 0 ? '+' : ''}
                            {util.toPercentage(total.monthly.change)}%
                        </Percentage>
                        <Indicator positive={total.monthly.change >= 0} />
                    </DataCard>
                </DataRow>

                <DataRow>
                    <DataCard>
                        <Label>Bot Daily DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(bot.daily.amount)}
                        </Text>
                        <Percentage positive={bot.daily.change >= 0}>
                            {bot.daily.change >= 0 ? '+' : ''}
                            {util.toPercentage(bot.daily.change)}%
                        </Percentage>
                        <Indicator positive={bot.daily.change >= 0} />
                    </DataCard>
                    <DataCard>
                        <Label>Bot Weekly DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(bot.weekly.amount)}
                        </Text>
                        <Percentage positive={bot.weekly.change >= 0}>
                            {bot.weekly.change >= 0 ? '+' : ''}
                            {util.toPercentage(bot.weekly.change)}%
                        </Percentage>
                        <Indicator positive={bot.weekly.change >= 0} />
                    </DataCard>
                    <DataCard>
                        <Label>Bot Monthly DEC</Label>
                        <Text size="48px">
                            {util.abbreviateNumber(bot.monthly.amount)}
                        </Text>
                        <Percentage positive={bot.monthly.change >= 0}>
                            {bot.monthly.change >= 0 ? '+' : ''}
                            {util.toPercentage(bot.monthly.change)}%
                        </Percentage>
                        <Indicator positive={bot.monthly.change >= 0} />
                    </DataCard>
                </DataRow>

                <ChartCard>
                    <ChartHeader>Daily Earnings in DEC</ChartHeader>
                    <LineChart data={[stats.bot.weekly, stats.total.weekly]} />
                </ChartCard>
            </>
        </DashboardPage>
    );
};

export default Account;
