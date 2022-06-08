import styled from '@emotion/styled';

const Label = styled.label`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: ${({ theme }) => theme.space(6)};
    font-weight: bold;
    font-size: 18px;
`;

export default Label;
