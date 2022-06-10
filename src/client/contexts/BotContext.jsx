import React, { useContext, useEffect, useState } from 'react';

const initialState = {
    botActive: false,
    botSettings: {
        listPrice: 'average',
        monstersRegularUnit: 'level',
        monstersRegularOperator: 'gt',
        monstersRegularAmount: 0,
        monstersGoldUnit: 'level',
        monstersGoldOperator: 'gt',
        monstersGoldAmount: 0,
        summonersRegularUnit: 'level',
        summonersRegularOperator: 'gt',
        summonersRegularAmount: 0,
        summonersGoldUnit: 'level',
        summonersGoldOperator: 'gt',
        summonersGoldAmount: 0,
    },
};

export const BotContext = React.createContext({ ...initialState });

export const useBot = () => useContext(BotContext);

export const BotProvider = (props) => {
    const [botActive, setBotActive] = useState(false);
    const [botSettings, setBotSettings] = useState(initialState.botSettings);

    useEffect(() => {
        const getActive = async () => {
            const res = await window.api.bot.getActive();
            if (res.code === 1) {
                setBotActive(res.data.active);
            }
        };
        const getSettings = async () => {
            const res = await window.api.bot.getSettings();
            if (res.code === 1) {
                setBotSettings(res.data.settings);
            }
        };
        getActive();
        getSettings();
    }, []);

    const toggleBotStatus = async () => {
        if (botActive) {
            setBotActive(false);
            await window.api.bot.stop();
        } else {
            setBotActive(true);
            await window.api.bot.start();
        }
    };

    const updateBotSettings = async (settings) => {
        setBotSettings(settings);
        await window.api.bot.updateSettings({ settings });
    };

    return (
        <BotContext.Provider
            value={{
                ...initialState,
                botActive,
                botSettings,
                toggleBotStatus,
                updateBotSettings,
            }}
        >
            {props.children}
        </BotContext.Provider>
    );
};
