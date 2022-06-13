import styled from '@emotion/styled';

const Text = styled.p`
    font-size: ${({ size }) => size || '16px'};
    font-weight: ${({ weight }) => weight || 'normal'};
`;

export default Text;
