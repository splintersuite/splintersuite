import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';

import theme from '../theme';
import Routes from './Routes.jsx';

const App = () => {
    return (
        <MantineProvider
            theme={{ primaryColor: 'violet', fontFamily: 'Source Sans Pro' }}
        >
            <ThemeProvider theme={theme}>
                <Routes />
            </ThemeProvider>
        </MantineProvider>
    );
};

export default App;
