import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@mantine/core';

import Page from '../components/Page.jsx';
import hero from '../assets/images/hero.jpg';

const PageBackground = styled(Page)`
    background-image: url(${hero});
    background-size: cover;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 456px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
`;

const Heading = styled.h1`
    font-size: 40px;
    margin-top: ${({ theme }) => theme.space(12)};
`;

const Description = styled.p`
    margin-top: ${({ theme }) => theme.space(1)};
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: 20px;
`;

const Landing = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/app');
    };

    return (
        <PageBackground>
            <Box>
                <Heading>Rent your cards with ease</Heading>
                <Description>
                    SplinterSuite automatically and intelligently rents out your
                    cards and helps you earn passively
                </Description>
                <Button size="lg" onClick={handleClick}>
                    Get Started
                </Button>
            </Box>
        </PageBackground>
    );
};

export default Landing;
