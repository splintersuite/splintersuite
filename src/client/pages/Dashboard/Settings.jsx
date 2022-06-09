import React from 'react';
import styled from '@emotion/styled';
import { Button, Radio, RadioGroup, Select, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import Row from '../../components/Row.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';

const StyledRow = styled(Row)`
    width: 200px;
`;

const Controls = () => {
    const form = useForm({
        initialValues: {
            listPrice: '',
            monstersRegularUnit: '',
            monstersRegularOperator: '',
            monstersRegularAmount: '',
            monstersGoldUnit: '',
            monstersGoldOperator: '',
            monstersGoldAmount: '',
            summonersRegularUnit: '',
            summonersRegularOperator: '',
            summonersRegularAmount: '',
            summonersGoldUnit: '',
            summonersGoldOperator: '',
            summonersGoldAmount: '',
        },
    });

    const handleSubmit = (values) => {
        console.log(values);
    };
    return (
        <DashboardPage>
            <h1>Settings</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Label>
                    <Text>List Price</Text>
                    <RadioGroup
                        {...form.getInputProps('listPrice', { type: 'radio' })}
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
                            {...form.getInputProps('summonersRegularAmount', {
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
                <Text>Bot Status</Text>
                <StyledRow>
                    <Button>Start</Button>
                    <Button>Stop</Button>
                </StyledRow>
            </Label>
        </DashboardPage>
    );
};

export default Controls;
