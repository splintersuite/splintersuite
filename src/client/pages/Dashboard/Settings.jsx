import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, NumberInput, Indicator } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { useForm } from '@mantine/form';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import Row from '../../components/Row.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';

import { useBot } from '../../contexts/BotContext.jsx';

const StyledRow = styled(Row)`
    width: 200px;
    justify-content: flex-start;
`;

const StyledNumber = styled(NumberInput)`
    width: 72px;
`;

const StartButton = styled(Button)`
    min-width: 100px;
    margin-right: ${({ theme }) => theme.space(4)};
`;

const SectionHeader = styled.h2`
    margin-top: ${({ theme }) => theme.space(6)};
`;

const StyledLabel = styled(Label)`
    font-size: 16px;
    width: 256px;
`;

const FirstLabel = styled(StyledLabel)`
    margin-top: ${({ theme }) => theme.space(2)};
`;

const Settings = () => {
    const [botStatusColor, setBotStatusColor] = useState('red');
    const [botStatusText, setBotStatusText] = useState('Start');

    const { botActive, botSettings, toggleBotStatus, updateBotSettings } =
        useBot();

    const form = useForm({
        initialValues: {
            ...botSettings,
        },
    });

    const handleSubmit = (values) => {
        updateBotSettings(values);
    };

    useEffect(() => {
        if (botActive) {
            setBotStatusColor('green');
            setBotStatusText('Stop');
        } else {
            setBotStatusColor('red');
            setBotStatusText('Start');
        }
    }, [botActive]);

    return (
        <DashboardPage>
            <h1>Settings</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <SectionHeader>Choose Minimum Level</SectionHeader>
                <Row>
                    <FirstLabel>
                        <Text>Common Monsters</Text>
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('commonNorm', {
                                type: 'number',
                            })}
                        />
                    </FirstLabel>
                    <FirstLabel>
                        <Text>Common Monsters - Gold</Text>
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('commonGold', {
                                type: 'number',
                            })}
                        />
                    </FirstLabel>
                </Row>

                <Row>
                    <StyledLabel>
                        <Text>Rare Monsters</Text>
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('rareNorm', {
                                type: 'number',
                            })}
                        />
                    </StyledLabel>

                    <StyledLabel>
                        <Text>Rare Monsters - Gold</Text>
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('rareGold', {
                                type: 'number',
                            })}
                        />
                    </StyledLabel>
                </Row>

                <Row>
                    <StyledLabel>
                        <Text>Epic Monsters</Text>
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('epicNorm', {
                                type: 'number',
                            })}
                        />
                    </StyledLabel>

                    <StyledLabel>
                        <Text>Epic Monsters - Gold</Text>
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('epicGold', {
                                type: 'number',
                            })}
                        />
                    </StyledLabel>
                </Row>

                <Row>
                    <StyledLabel>
                        <Text>Legendary Monsters</Text>
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('legendaryNorm', {
                                type: 'number',
                            })}
                        />
                    </StyledLabel>

                    <StyledLabel>
                        <Text>Legendary Monsters - Gold</Text>
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('legendaryGold', {
                                type: 'number',
                            })}
                        />
                    </StyledLabel>
                </Row>

                <Label>
                    <Text>Daily Relistings</Text>
                    <StyledNumber
                        min={0}
                        {...form.getInputProps('legendaryGold', {
                            type: 'number',
                        })}
                    />
                </Label>

                <Button style={{ marginTop: '2em' }} type="submit">
                    Save Settings
                </Button>
            </form>

            <Label onClick={(e) => e.preventDefault()}>
                <StyledRow>
                    <Text>Bot Status</Text>
                </StyledRow>
                <StyledRow>
                    <StartButton
                        color={botActive ? 'red' : 'green'}
                        size="lg"
                        onClick={toggleBotStatus}
                    >
                        {botStatusText}
                    </StartButton>
                    <Indicator
                        color={botStatusColor}
                        size={14}
                        style={{ margin: '1em 0' }}
                    >
                        <FontAwesomeIcon size={'2x'} icon={faRobot} />
                    </Indicator>
                </StyledRow>
            </Label>
        </DashboardPage>
    );
};

export default Settings;
