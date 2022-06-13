import React from 'react';
import styled from '@emotion/styled';

import Label from '../components/Label.jsx';

const Container = styled.div`
    display: flex;
    width: 300px;
    padding: ${({ theme }) => theme.space(2)};
    padding-right: ${({ theme }) => theme.space(1)};
    margin-right: ${({ theme }) => theme.space(4)};
    background: ${({ theme }) => theme.colors.grey[900]};
    border-radius: 8px;
`;

const InputLabel = styled(Label)`
    margin-right: auto;
    opacity: 1;
`;

const Input = styled.input`
    width: 64px;
    padding-left: ${({ theme }) => theme.space(3)};
    margin-left: ${({ theme }) => theme.space(1)};
    color: white;
    font-size: 16px;
    font-weight: bold;
    font-family: 'Source Sans Pro';
    outline: none;
    border: none;
    border-left: ${({ theme }) => `2px solid ${theme.colors.grey[800]}`};
    background: transparent;
`;

const LineInput = ({ label, min, max, ...props }) => {
    return (
        <Container>
            <InputLabel>{label}</InputLabel>
            <Input {...props} min={min} max={max} type="number" />
        </Container>
    );
};

export default LineInput;
