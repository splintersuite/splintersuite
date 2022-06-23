import React from 'react';
import styled from '@emotion/styled';
import { Button, Input } from '@mantine/core';
import { useForm } from '@mantine/form';

import Text from '../../components/Text.jsx';
import Row from '../../components/Row.jsx';
import Card from '../../components/Card.jsx';
import LineInput from '../../components/LineInput.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';
import { useBot } from '../../contexts/BotContext.jsx';

const SectionSubheader = styled(Text)`
    margin-bottom: ${({ theme }) => theme.space(4)};
`;

const InputRow = styled(Row)`
    margin-bottom: ${({ theme }) => theme.space(4)};
`;

const CPInput = styled(LineInput)`
    input {
        width: 108px;
    }
`;

const Settings = () => {
    const { botSettings, updateBotSettings } = useBot();
    const form = useForm({
        initialValues: {
            ...botSettings,
        },
    });

    const handleSubmit = (values) => {
        const formattedValues = {};
        for (const [key, value] of Object.entries(values)) {
            formattedValues[key] = parseInt(value);
        }
        updateBotSettings(formattedValues);
    };

    const handleBlur = () => {
        handleSubmit(form.values);
    };

    return (
        <DashboardPage>
            <Card>
                <Row>
                    <h1>Settings</h1>
                    <Button
                        style={{ marginLeft: 'auto' }}
                        onClick={form.onSubmit(handleSubmit)}
                    >
                        Save Settings
                    </Button>
                </Row>
            </Card>

            <form onSubmit={form.onSubmit(handleSubmit)} onBlur={handleBlur}>
                <Card>
                    <h2>Choose Daily Relistings</h2>
                    <SectionSubheader>
                        This will determine how frequently the bot attempts to
                        relist your cards.
                    </SectionSubheader>

                    <LineInput
                        label="Daily Relistings"
                        min={1}
                        max={24}
                        {...form.getInputProps('dailyRelistings', {
                            type: 'number',
                        })}
                    />
                </Card>

                <Card>
                    <h2>Choose Minimum Levels</h2>
                    <SectionSubheader>
                        All monsters and summoners greater than or equal to the
                        selected level will be listed for rental.
                    </SectionSubheader>

                    <InputRow>
                        <LineInput
                            label="Common Cards"
                            min={1}
                            max={10}
                            {...form.getInputProps('commonNorm', {
                                type: 'number',
                            })}
                        />
                        <LineInput
                            label="Common Cards - Gold"
                            min={1}
                            max={10}
                            {...form.getInputProps('commonGold', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <InputRow>
                        <LineInput
                            label="Rare Cards"
                            min={1}
                            max={8}
                            {...form.getInputProps('rareNorm', {
                                type: 'number',
                            })}
                        />
                        <LineInput
                            label="Rare Cards - Gold"
                            min={1}
                            max={8}
                            {...form.getInputProps('rareGold', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <InputRow>
                        <LineInput
                            label="Epic Cards"
                            min={1}
                            max={6}
                            {...form.getInputProps('epicNorm', {
                                type: 'number',
                            })}
                        />
                        <LineInput
                            label="Epic Cards - Gold"
                            min={1}
                            max={6}
                            {...form.getInputProps('epicGold', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <Row>
                        <LineInput
                            label="Legendary Cards"
                            min={1}
                            max={4}
                            {...form.getInputProps('legendaryNorm', {
                                type: 'number',
                            })}
                        />
                        <LineInput
                            label="Legendary Cards - Gold"
                            min={1}
                            max={4}
                            {...form.getInputProps('legendaryGold', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Card>

                <Card>
                    <h2>Choose Minimum CP</h2>
                    <SectionSubheader>
                        All monsters and summoners greater than or equal to the
                        selected CP will be listed for rental.
                    </SectionSubheader>

                    <InputRow>
                        <CPInput
                            label="Common Cards"
                            min={0}
                            step={5}
                            {...form.getInputProps('commonCP', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <InputRow>
                        <CPInput
                            label="Rare Cards"
                            min={0}
                            step={10}
                            {...form.getInputProps('rareCP', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <InputRow>
                        <CPInput
                            label="Epic Cards"
                            min={0}
                            step={100}
                            {...form.getInputProps('epicCP', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <Row>
                        <CPInput
                            label="Legendary Cards"
                            min={0}
                            step={500}
                            {...form.getInputProps('legendaryCP', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Card>
            </form>
        </DashboardPage>
    );
};

export default Settings;
