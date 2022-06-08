import React from 'react';
import styled from '@emotion/styled';
import { Button, Input } from '@mantine/core';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';

const Settings = () => {
    return (
        <DashboardPage>
            <h1>Settings</h1>

            <Label>
                <Text>Active Key</Text>
                <Input style={{ width: '256px' }} placeholder="12312324123" />
                <Button style={{ marginTop: '8px' }}>Save</Button>
            </Label>
        </DashboardPage>
    );
};

export default Settings;
