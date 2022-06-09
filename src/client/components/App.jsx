import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';

import { UserProvider } from '../contexts/UserContext.jsx';
import theme from '../theme';
import Routes from './Routes.jsx';

const App = () => {
    return (
        <MantineProvider
            theme={{ primaryColor: 'violet', fontFamily: 'Source Sans Pro' }}
        >
            <ThemeProvider theme={theme}>
                <UserProvider>
                    <Routes />
                </UserProvider>
            </ThemeProvider>
        </MantineProvider>
    );
};

export default App;
