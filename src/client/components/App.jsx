import React from 'react';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';

import theme from '../theme';
import logo from '../assets/logo.png';

const Container = styled.div`
    min-height: 100vh;
    padding: ${({ theme }) => theme.space(4)};
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.grey[900]};
`;
console.log(theme);

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Container>
                <img src={logo} />
                <p>
                    I wanna be the very best Like no one ever was To catch them
                    is my real test To train them is my cause I will travel
                    across the land Searching far and wide Teach Pokémon to
                    understand The power that's inside [Chorus] (Pokémon, gotta
                    catch 'em all) It's you and me I know it's my destiny
                    (Pokémon) Oh, you're my best friend In a world we must
                    defend (Pokémon, gotta catch 'em all) A heart so true Our
                    courage will pull us through You teach me and I'll teach you
                    Pokémon! (Gotta catch 'em all) Gotta catch 'em all Yeah
                    [Verse 2] Every challenge along the way With courage I will
                    face I will battle every day To claim my rightful place Come
                    with me, the time is right There's no better team Arm in
                    arm, we'll win the fight It's always been our dream [Chorus]
                    (Pokémon, gotta catch 'em all) It's you and me I know it's
                    my destiny (Pokémon) Oh, you're my best friend In a world we
                    must defend (Pokémon, gotta catch 'em all) A heart so true
                    Our courage will pull us through You teach me and I'll teach
                    you Pokémon! (Gotta catch 'em all) Gotta catch 'em all
                    [Bridge] Gotta catch 'em all Gotta catch 'em all Gotta catch
                    'em all Yeah [Guitar Solo]
                </p>
            </Container>
        </ThemeProvider>
    );
};

export default App;
