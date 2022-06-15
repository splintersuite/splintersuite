import React from 'react';
import styled from '@emotion/styled';
import { Button, Input } from '@mantine/core';
import { useForm } from '@mantine/form';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import Card from '../../components/Card.jsx';
import Col from '../../components/Col.jsx';
import Row from '../../components/Row.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';
import LineChart from '../../components/LineChart.jsx';
import { useUser } from '../../contexts/UserContext.jsx';

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
    width: calc(33% - 21px);
`;

const ChartCard = styled(Card)`
    width: 100%;
`;

const ChartHeader = styled.h2`
    margin-bottom: ${({ theme }) => theme.space(4)};
`;

const Settings = () => {
    const { user, username, handleLogin } = useUser();
    const form = useForm({
        initialValues: {
            username: '',
            key: '',
        },
    });

    const handleSubmit = (values) => {
        handleLogin(values);
    };

    return (
        <DashboardPage>
            {username && (
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
                                    {user?.balances?.dec || 0}
                                </Text>
                            </StatCol>
                            <StatCol>
                                <Label>SPS</Label>
                                <Text size="32px">
                                    {user?.balances?.sps || 0}
                                </Text>
                            </StatCol>
                            <StatCol>
                                <Label>RC</Label>
                                <Text size="32px">
                                    {user?.balances?.rc || 0}%
                                </Text>
                            </StatCol>
                        </Row>
                    </Card>
                    <DataRow>
                        <DataCard>
                            <Text size="64px">Data</Text>
                        </DataCard>
                        <DataCard>
                            <Text size="64px">Data</Text>
                        </DataCard>
                        <DataCard>
                            <Text size="64px">Data</Text>
                        </DataCard>
                    </DataRow>
                    <ChartCard>
                        <ChartHeader>Daily Earnings in DEC</ChartHeader>
                        <LineChart />
                    </ChartCard>
                </>
            )}

            {!username && (
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Label htmlFor={'username'}>Username</Label>
                    <Input
                        label="Username"
                        style={{ width: '256px' }}
                        placeholder="Tameshon"
                        {...form.getInputProps('username')}
                    />
                    <Label style={{ marginTop: '16px' }} htmlFor={'key'}>
                        Active Key
                    </Label>
                    <Input
                        label="Active Key"
                        style={{ width: '256px' }}
                        placeholder="12312324123"
                        {...form.getInputProps('key')}
                    />
                    <Button type="submit" style={{ marginTop: '2em' }}>
                        Login
                    </Button>
                </form>
            )}
        </DashboardPage>
    );
};

export default Settings;