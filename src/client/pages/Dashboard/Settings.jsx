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
`;

const Settings = () => {
    const {
        botActive,
        botSettings,
        toggleBotStatus,
        updateBotSettings,
        getBotSettings,
    } = useBot();
    const form = useForm({
        initialValues: {
            botSettings,
        },
    });

    useEffect(() => {
        form.setValues(botSettings);
        // getBotSettings();
    }, []);

    const [botStatusColor, setBotStatusColor] = useState('red');
    const [botStatusText, setBotStatusText] = useState('Start');

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
                        initialValue={botSettings.listPrice}
                    >
                        <Radio value="low" label="Undercut lowest price" />
                        <Radio value="average" label="Undercut average price" />
                    </RadioGroup>
                </Label>

                <Label>
                    <Text>Monsters - Regular</Text>
                    <Row>
                        <Select
                            style={{ paddingRight: '16px' }}
                            data={['CP', 'BCX']}
                            {...form.getInputProps('monstersRegularUnit', {
                                type: 'select',
                            })}
                        />
                        <Select
                            style={{ paddingRight: '16px' }}
                            data={['Greater than', 'Equal to', 'Less than']}
                            {...form.getInputProps('monstersRegularOperator', {
                                type: 'select',
                            })}
                        />
                        <NumberInput
                            style={{ width: '72px' }}
                            {...form.getInputProps('monstersRegularAmount', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Label>

                <Label>
                    <Text>Monsters - Gold</Text>
                    <Row>
                        <Select
                            style={{ paddingRight: '16px' }}
                            data={['CP', 'BCX']}
                            {...form.getInputProps('monstersGoldUnit', {
                                type: 'select',
                            })}
                        />
                        <Select
                            style={{ paddingRight: '16px' }}
                            data={['Greater than', 'Equal to', 'Less than']}
                            {...form.getInputProps('monstersGoldOperator', {
                                type: 'select',
                            })}
                        />
                        <NumberInput
                            style={{ width: '72px' }}
                            {...form.getInputProps('monstersGoldAmount', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Label>

                <Label>
                    <Text>Summoners - Regular</Text>
                    <Row>
                        <Select
                            style={{ paddingRight: '16px' }}
                            data={['CP', 'BCX']}
                            {...form.getInputProps('summonersRegularUnit', {
                                type: 'select',
                            })}
                        />
                        <Select
                            style={{ paddingRight: '16px' }}
                            data={['Greater than', 'Equal to', 'Less than']}
                            {...form.getInputProps('summonersRegularOperator', {
                                type: 'select',
                            })}
                        />
                        <NumberInput
                            style={{ width: '72px' }}
                            {...form.getInputProps('summonersRegularAmount', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Label>

                <Label>
                    <Text>Summoners - Gold</Text>
                    <Row>
                        <Select
                            style={{ paddingRight: '16px' }}
                            data={['CP', 'BCX']}
                            {...form.getInputProps('summonersGoldUnit', {
                                type: 'select',
                            })}
                        />
                        <Select
                            style={{ paddingRight: '16px' }}
                            data={['Greater than', 'Equal to', 'Less than']}
                            {...form.getInputProps('summonersGoldOperator', {
                                type: 'select',
                            })}
                        />
                        <NumberInput
                            style={{ width: '72px' }}
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
            <Label>
                <StyledRow>
                    <Text>Bot Status</Text>
                </StyledRow>
                <Indicator
                    color={botStatusColor}
                    size={14}
                    style={{ margin: '1em 0' }}
                >
                    <FontAwesomeIcon size={'2x'} icon={faRobot} />
                </Indicator>
                <StyledRow>
                    <Button
                        color={botActive ? 'red' : 'green'}
                        onClick={toggleBotStatus}
                    >
                        {botStatusText}
                    </Button>
                </StyledRow>
            </Label>
        </DashboardPage>
    );
};

export default Settings;
