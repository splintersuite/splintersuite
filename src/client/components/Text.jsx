import styled from '@emotion/styled';

const Text = styled.p`
    font-size: ${({ size }) => size || '16px'};
    /* margin-bottom: ${({ theme }) => theme.space(1)}; */
`;

export default Text;
