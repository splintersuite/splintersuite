import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
    padding: ${({ theme }) => theme.space(3)};
    margin-bottom: ${({ theme }) => theme.space(4)};
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadow};
    background-color: ${({ theme }) => theme.colors.grey[850]};
`;

export default Card;
