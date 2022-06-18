import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mantine/core';
import moment from 'moment';

import Col from './Col.jsx';
import Row from './Row.jsx';
import Label from './Label.jsx';
import Text from './Text.jsx';
import { useBot } from '../contexts/BotContext.jsx';

const Container = styled.div`
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: calc(100% - 256px);
    margin-left: 256px;
    padding: ${({ theme }) => theme.space(4)};
    padding-left: ${({ theme }) => theme.space(8)};
    padding-right: ${({ theme }) => theme.space(8)};
    background: ${({ theme }) => theme.colors.grey[900]};
    border-left: ${({ theme }) => `1px solid ${theme.colors.grey[800]}`};
`;

const FooterCol = styled(Col)`
    align-items: flex-start;
`;

const FooterRow = styled(Row)`
    justify-content: space-between;
`;

const Status = styled.span`
    padding-left: ${({ theme }) => theme.space(0.5)};
    color: ${(props) =>
        props.active ? props.theme.colors.success : props.theme.colors.error};
`;

const BotLabel = styled(Label)`
    padding-bottom: ${({ theme }) => theme.space(1)};
`;

const Icon = styled(FontAwesomeIcon)`
    padding-right: ${({ theme }) => theme.space(1)};
`;

const StatCol = styled(Col)`
    align-items: flex-end;
    margin-left: ${({ theme }) => theme.space(4)};
`;

const Footer = (props) => {
    const { botActive, botStats, botLoading, getBotLoading, toggleBotActive } =
        useBot();

    const startedAt = botStats?.startedAt
        ? moment(botStats.startedAt).fromNow(true)
        : 'n/a';

    const getDuration = () => {
        if (!botStats?.startedAt) {
            return 'n/a';
        } else {
            const start = moment(botStats.startedAt);
            const end = botStats.endedAt ? moment(botStats.endedAt) : moment();
            const duration = moment.duration(end.diff(start));
            return duration.humanize();
        }
    };

    return (
        <Container>
            <FooterRow>
                <FooterCol>
                    <BotLabel>
                        Bot Status:
                        <Status active={botActive}>
                            {botActive ? 'Active' : 'Inactive'}
                        </Status>
                    </BotLabel>
                    <Button
                        size="lg"
                        color={botActive ? 'red' : 'primary'}
                        loading={botLoading}
                        onClick={toggleBotActive}
                    >
                        <Icon icon={faRobot} />
                        {botActive ? 'Stop Bot' : 'Start Bot'}
                    </Button>
                </FooterCol>
                <Row>
                    <StatCol>
                        <Label>Time Active</Label>
                        <Text size="24px">{getDuration()}</Text>
                    </StatCol>
                    <StatCol>
                        <Label>Cards Listed</Label>
                        <Text size="24px">{botStats?.numListed || 0}</Text>
                    </StatCol>
                </Row>
            </FooterRow>
        </Container>
    );
};

export default Footer;
