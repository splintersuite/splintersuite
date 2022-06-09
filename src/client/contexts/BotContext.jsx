import React, { useContext, useEffect, useState } from 'react';

const initialState = {
    botActive: false,
    botSettings: {
        listPrice: '',
        monstersRegularUnit: '',
        monstersRegularOperator: '',
        monstersRegularAmount: 0,
        monstersGoldUnit: '',
        monstersGoldOperator: '',
        monstersGoldAmount: 0,
        summonersRegularUnit: '',
        summonersRegularOperator: '',
        summonersRegularAmount: 0,
        summonersGoldUnit: '',
        summonersGoldOperator: '',
        summonersGoldAmount: 0,
    },
};

export const BotContext = React.createContext({ ...initialState });

export const useBot = () => useContext(BotContext);

export const BotProvider = (props) => {
    const [botActive, setBotActive] = useState(false);
    const [botSettings, setBotSettings] = useState(initialState.botSettings);

    const toggleBotStatus = () => {
        if (botActive) {
            setBotActive(false);
            // ipc method here
        } else {
            setBotActive(true);
            // ipc method here
        }
    };

    const updateBotSettings = (settings) => {
        setBotSettings(settings);
        // ipc method here
    };

    const getBotSettings = () => {};

    return (
        <BotContext.Provider
            value={{
                ...initialState,
                botActive,
                botSettings,
                toggleBotStatus,
                updateBotSettings,
                getBotSettings,
            }}
        >
            {props.children}
        </BotContext.Provider>
    );
};
