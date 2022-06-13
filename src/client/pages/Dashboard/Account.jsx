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

const GraphCard = styled(Card)`
    width: 100%;
    height: 512px;
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
                                <Text size="32px">{user?.balances?.dec}</Text>
                            </StatCol>
                            <StatCol>
                                <Label>SPS</Label>
                                <Text size="32px">{user?.balances?.sps}</Text>
                            </StatCol>
                            <StatCol>
                                <Label>RC</Label>
                                <Text size="32px">{user?.balances?.rc}%</Text>
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
                    <GraphCard>
                        <Text size="64px">Line Graph</Text>
                    </GraphCard>
                </>
            )}

            {!username && (
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Label htmlFor={'username'}>
                        <Text>Username</Text>
                        <Input
                            label="Username"
                            style={{ width: '256px' }}
                            placeholder="Tameshon"
                            {...form.getInputProps('username')}
                        />
                    </Label>
                    <Label htmlFor={'key'}>
                        <Text>Active Key</Text>
                        <Input
                            label="Active Key"
                            style={{ width: '256px' }}
                            placeholder="12312324123"
                            {...form.getInputProps('key')}
                        />
                    </Label>
                    <Button type="submit" style={{ marginTop: '2em' }}>
                        Login
                    </Button>
                </form>
            )}
        </DashboardPage>
    );
};

export default Settings;
