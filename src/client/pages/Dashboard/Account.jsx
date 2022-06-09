import React from 'react';
import styled from '@emotion/styled';
import { Button, Input } from '@mantine/core';
import { useForm } from '@mantine/form';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';

const Settings = () => {
    const form = useForm({
        initialValues: {
            username: '',
            activeKey: '',
        },
    });

    // handles submission of form data to server route
    const handleSubmit = (values) => {
        console.log(values);
    };

    return (
        <DashboardPage>
            <h1>Account</h1>
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
                <Label htmlFor={'activeKey'}>
                    <Text>Active Key</Text>
                    <Input
                        label="Active Key"
                        style={{ width: '256px' }}
                        placeholder="12312324123"
                        {...form.getInputProps('activeKey')}
                    />
                </Label>
                <Button type="submit" style={{ marginTop: '2em' }}>
                    Submit
                </Button>
            </form>
        </DashboardPage>
    );
};

export default Settings;
