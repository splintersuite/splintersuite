import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button, Checkbox, Input, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
// import { shell } from 'electron';

import { errors, alerts } from '../util/constants';
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

const LabelBox = styled.div`
    display: flex;
    justify-content: flex-start;
    max-width: 456px;
    align-items: center;
    margin-top: 16px;
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

const StyledAnchor = styled(Anchor)`
    display: flex;
    font-weight: bold;
    font-size: 18px;
    opacity: 1;
    margin-left: 6px;
    text-decoration: underline;
`;

const Landing = () => {
    const { username, handleLogin } = useUser();
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    const form = useForm({
        initialValues: {
            username: '',
            key: '',
        },
    });

    const handleSubmit = async (values) => {
        const res = await handleLogin(values);
        if (res?.code === 1) {
            navigate('/app');
        } else if (typeof res.error === 'string') {
            showNotification({
                title: 'Error',
                message:
                    res.error === errors.NOT_DELEGATED
                        ? alerts.delegation
                        : alerts.postingKey,
                color: 'red',
                autoClose: false,
            });
        }
    };

    return (
        <PageBackground>
            {username !== '' && <Navigate to="/app" />}
            <Box>
                <Heading>Log In</Heading>
                <Form onSubmit={form.onSubmit(handleSubmit)}>
                    <StyledLabel htmlFor={'username'}>Username</StyledLabel>
                    <Input
                        label="Username"
                        style={{ width: '282px' }}
                        placeholder="Username"
                        {...form.getInputProps('username')}
                    />
                    {!checked && (
                        <div>
                            <StyledLabel
                                style={{ marginTop: '16px' }}
                                htmlFor={'key'}
                            >
                                Posting Key
                            </StyledLabel>
                            <Input
                                label="Posting Key"
                                style={{ width: '282px' }}
                                placeholder="1A30DM9L4JK5..."
                                {...form.getInputProps('key')}
                            />
                        </div>
                    )}
                    <LabelBox>
                        <Checkbox
                            checked={checked}
                            onChange={(event) => {
                                setChecked(event.currentTarget.checked);
                                form.setFieldValue('key', '');
                            }}
                            color="violet"
                            style={{ marginRight: '16px' }}
                        />
                        <Label htmlFor="checkbox">Login With </Label>
                        <StyledAnchor
                            onClick={(event) => {
                                window.api.user.openBlog();
                            }}
                        >
                            Authority Delegation
                        </StyledAnchor>
                    </LabelBox>
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
