import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Loader } from '@mantine/core';

import { useUser } from '../contexts/UserContext.jsx';
import logo from '../assets/images/logo.png';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    padding-bottom: ${({ theme }) => theme.space(24)};
    background: ${({ theme }) =>
        `linear-gradient(${theme.colors.grey[900]}, ${theme.colors.grey[800]} )`};
`;

const Logo = styled.img`
    width: 256px;
    margin-bottom: ${({ theme }) => theme.space(4)};
`;

const Loading = () => {
    const { username, userLoading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading) {
            if (username !== '') {
                navigate('/app');
            } else {
                navigate('/home');
            }
        }
    }, [userLoading]);

    return (
        <Container>
            <Logo src={logo} />
            <Loader variant="dots" />
        </Container>
    );
};

export default Loading;
