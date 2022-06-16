import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { UserProvider } from '../contexts/UserContext.jsx';
import { BotProvider } from '../contexts/BotContext.jsx';
import theme from '../theme';
import Routes from './Routes.jsx';

const App = () => {
    return (
        <MantineProvider
            theme={{ primaryColor: 'violet', fontFamily: 'Source Sans Pro' }}
        >
            <NotificationsProvider position="top-right">
                <ThemeProvider theme={theme}>
                    <UserProvider>
                        <BotProvider>
                            <Routes />
                        </BotProvider>
                    </UserProvider>
                </ThemeProvider>
            </NotificationsProvider>
        </MantineProvider>
    );
};

export default App;
