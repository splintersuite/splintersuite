import React from 'react';
import styled from '@emotion/styled';
import { Button, Radio, RadioGroup, Select, NumberInput } from '@mantine/core';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import Row from '../../components/Row.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';

const StyledRow = styled(Row)`
    width: 200px;
`;

const Controls = () => {
    return (
        <DashboardPage>
            <h1>Settings</h1>
            <Label>
                <Text>List Price</Text>
                <RadioGroup>
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
                    />
                    <Select
                        style={{ paddingRight: '16px' }}
                        data={['Greater than', 'Equal to', 'Less than']}
                    />
                    <NumberInput style={{ width: '72px' }} />
                </Row>
            </Label>

            <Label>
                <Text>Monsters - Gold</Text>
                <Row>
                    <Select
                        style={{ paddingRight: '16px' }}
                        data={['CP', 'BCX']}
                    />
                    <Select
                        style={{ paddingRight: '16px' }}
                        data={['Greater than', 'Equal to', 'Less than']}
                    />
                    <NumberInput style={{ width: '72px' }} />
                </Row>
            </Label>

            <Label>
                <Text>Summoners - Regular</Text>
                <Row>
                    <Select
                        style={{ paddingRight: '16px' }}
                        data={['CP', 'BCX']}
                    />
                    <Select
                        style={{ paddingRight: '16px' }}
                        data={['Greater than', 'Equal to', 'Less than']}
                    />
                    <NumberInput style={{ width: '72px' }} />
                </Row>
            </Label>

            <Label>
                <Text>Summoners - Gold</Text>
                <Row>
                    <Select
                        style={{ paddingRight: '16px' }}
                        data={['CP', 'BCX']}
                    />
                    <Select
                        style={{ paddingRight: '16px' }}
                        data={['Greater than', 'Equal to', 'Less than']}
                    />
                    <NumberInput style={{ width: '72px' }} />
                </Row>
            </Label>
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
