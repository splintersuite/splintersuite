import React from 'react';
import styled from '@emotion/styled';
import { Button, Input } from '@mantine/core';
import { useForm } from '@mantine/form';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';
import { useUser } from '../../contexts/UserContext.jsx';

const Username = styled(Text)`
    font-size: 40px;
`;

const Settings = () => {
    const { username, handleLogin } = useUser();
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
            <h1>Account</h1>
            {username && (
                <Label htmlFor={'username'}>
                    <Text>Currently logged in as:</Text>
                    <Username>{username}</Username>
                </Label>
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
