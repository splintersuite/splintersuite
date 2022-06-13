import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, NumberInput, Indicator } from '@mantine/core';
import { useForm } from '@mantine/form';

import Label from '../../components/Label.jsx';
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

const Settings = () => {
    const { botSettings, updateBotSettings } = useBot();
    const form = useForm({
        initialValues: {
            ...botSettings,
        },
    });

    const handleSubmit = (values) => {
        console.log('submit');
        const formattedValues = {};
        for (const [key, value] of Object.entries(values)) {
            formattedValues[key] = parseInt(value);
        }
        updateBotSettings(formattedValues);
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

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Card>
                    <h2>Choose Minimum Levels</h2>
                    <SectionSubheader>
                        All monsters greater than or equal to the selected level
                        will be listed for rental.
                    </SectionSubheader>

                    <InputRow>
                        <LineInput
                            label="Common Monsters"
                            min={0}
                            max={10}
                            {...form.getInputProps('commonNorm', {
                                type: 'number',
                            })}
                        />
                        <LineInput
                            label="Common Monsters - Gold"
                            min={0}
                            max={10}
                            {...form.getInputProps('commonGold', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <InputRow>
                        <LineInput
                            label="Rare Monsters"
                            min={0}
                            max={8}
                            {...form.getInputProps('rareNorm', {
                                type: 'number',
                            })}
                        />
                        <LineInput
                            label="Rare Monsters - Gold"
                            min={0}
                            max={8}
                            {...form.getInputProps('rareGold', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <InputRow>
                        <LineInput
                            label="Epic Monsters"
                            min={0}
                            max={6}
                            {...form.getInputProps('epicNorm', {
                                type: 'number',
                            })}
                        />
                        <LineInput
                            label="Epic Monsters - Gold"
                            min={0}
                            max={6}
                            {...form.getInputProps('epicGold', {
                                type: 'number',
                            })}
                        />
                    </InputRow>

                    <Row>
                        <LineInput
                            label="Legendary Monsters"
                            min={0}
                            max={4}
                            {...form.getInputProps('legendaryNorm', {
                                type: 'number',
                            })}
                        />
                        <LineInput
                            label="Legendary Monsters - Gold"
                            min={0}
                            max={4}
                            {...form.getInputProps('legendaryGold', {
                                type: 'number',
                            })}
                        />
                    </Row>
                </Card>
            </form>

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
        </DashboardPage>
    );
};

export default Settings;
