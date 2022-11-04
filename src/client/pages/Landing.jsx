import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button, Input } from '@mantine/core';
import { useForm } from '@mantine/form';

import Page from '../components/Page.jsx';
import Label from '../components/Label.jsx';
import hero from '../assets/images/hero.jpg';
import { useUser } from '../contexts/UserContext.jsx';

const PageBackground = styled(Page)`
    background-image: url(${hero});
    background-size: cover;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    max-width: 456px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 128px;
    text-align: center;
`;

const Heading = styled.h1`
    font-size: 32px;
    margin-bottom: ${({ theme }) => theme.space(3)};
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const StyledLabel = styled(Label)`
    margin-bottom: ${({ theme }) => theme.space(0.5)};
`;

const Landing = () => {
    const { username, handleLogin } = useUser();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: '',
            key: '',
        },
    });

    const handleSubmit = async (values) => {
        await handleLogin(values);
        navigate('/app');
    };

    return (
        <PageBackground>
            {username !== '' && <Navigate to="/app" />}

            <Box>
                <Heading>Log In With Posting Key</Heading>
                <Form onSubmit={form.onSubmit(handleSubmit)}>
                    <StyledLabel htmlFor={'username'}>Username</StyledLabel>
                    <Input
                        label="Username"
                        style={{ width: '256px' }}
                        placeholder="Username"
                        {...form.getInputProps('username')}
                    />
                    <StyledLabel style={{ marginTop: '16px' }} htmlFor={'key'}>
                        Posting Key
                    </StyledLabel>
                    <Input
                        label="Posting Key"
                        style={{ width: '256px' }}
                        placeholder="1A30DM9L4JK5"
                        {...form.getInputProps('key')}
                    />
                    <Button
                        type="submit"
                        style={{ marginTop: '2em', alignSelf: 'flex-end' }}
                    >
                        Login
                    </Button>
                </Form>
            </Box>
            <Box>
                <Heading>Log In With Authority Delegation</Heading>
                <Form onSubmit={form.onSubmit(handleSubmit)}>
                    <StyledLabel htmlFor={'username'}>Username</StyledLabel>
                    <Input
                        label="Username"
                        style={{ width: '256px' }}
                        placeholder="Username"
                        {...form.getInputProps('username')}
                    />
                    <Button
                        type="submit"
                        style={{ marginTop: '2em', alignSelf: 'flex-end' }}
                    >
                        Login
                    </Button>
                </Form>
            </Box>
        </PageBackground>
    );
};

export default Landing;
