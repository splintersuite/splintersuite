import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
    Button,
    Radio,
    RadioGroup,
    Select,
    NumberInput,
    Indicator,
} from '@mantine/core';
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

const StyledSelect = styled(Select)`
    padding-right: ${({ theme }) => theme.space(2)};
`;

const StyledNumber = styled(NumberInput)`
    width: 72px;
`;

const StartButton = styled(Button)`
    min-width: 100px;
    margin-right: ${({ theme }) => theme.space(4)};
`;

const UNIT = [
    {
        label: 'CP',
        value: 'cp',
    },
    {
        label: 'Level',
        value: 'level',
    },
];

const OPERATOR = [
    {
        label: 'Greater than',
        value: 'gt',
    },
    {
        label: 'Equal to',
        value: 'et',
    },
    {
        label: 'Less than',
        value: 'lt',
    },
];

const Settings = () => {
    const [botStatusColor, setBotStatusColor] = useState('red');
    const [botStatusText, setBotStatusText] = useState('Start');

    const { botActive, botSettings, toggleBotStatus, updateBotSettings } =
        useBot();

    const form = useForm({
        initialValues: {
            botSettings,
        },
    });

    useEffect(() => {
        form.setValues(botSettings);
        // getBotSettings();
    }, []);

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
                <Label>
                    <Text>List Price</Text>
                    <RadioGroup
                        {...form.getInputProps('listPrice', { type: 'radio' })}
                    >
                        <Radio value="lowest" label="Undercut lowest price" />
                        <Radio value="average" label="Undercut average price" />
                    </RadioGroup>
                </Label>

                <Label>
                    <Text>Monsters - Regular</Text>
                    <Row>
                        <StyledSelect
                            data={UNIT}
                            {...form.getInputProps('monstersRegularUnit', {
                                type: 'select',
                            })}
                        />
                        <StyledSelect
                            data={OPERATOR}
                            {...form.getInputProps('monstersRegularOperator', {
                                type: 'select',
                            })}
                        />
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('monstersRegularAmount', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Label>

                <Label>
                    <Text>Monsters - Gold</Text>
                    <Row>
                        <StyledSelect
                            data={UNIT}
                            {...form.getInputProps('monstersGoldUnit', {
                                type: 'select',
                            })}
                        />
                        <StyledSelect
                            data={OPERATOR}
                            {...form.getInputProps('monstersGoldOperator', {
                                type: 'select',
                            })}
                        />
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('monstersGoldAmount', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Label>

                <Label>
                    <Text>Summoners - Regular</Text>
                    <Row>
                        <StyledSelect
                            data={UNIT}
                            {...form.getInputProps('summonersRegularUnit', {
                                type: 'select',
                            })}
                        />
                        <StyledSelect
                            data={OPERATOR}
                            {...form.getInputProps('summonersRegularOperator', {
                                type: 'select',
                            })}
                        />
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('summonersRegularAmount', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Label>

                <Label>
                    <Text>Summoners - Gold</Text>
                    <Row>
                        <StyledSelect
                            data={UNIT}
                            {...form.getInputProps('summonersGoldUnit', {
                                type: 'select',
                            })}
                        />
                        <StyledSelect
                            data={OPERATOR}
                            {...form.getInputProps('summonersGoldOperator', {
                                type: 'select',
                            })}
                        />
                        <StyledNumber
                            min={0}
                            {...form.getInputProps('summonersGoldAmount', {
                                type: 'number',
                            })}
                        />
                    </Row>
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
