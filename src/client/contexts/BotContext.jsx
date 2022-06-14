import React, { useContext, useEffect, useState } from 'react';

const initialState = {
    botActive: false,
    botSettings: {
        dailyRelistings: 0,
        commonNorm: 0,
        commonGold: 0,
        rareNorm: 0,
        rareGold: 0,
        epicNorm: 0,
        epicGold: 0,
        legendaryNorm: 0,
        legendaryGold: 0,
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

                if (res.data.active) {
                    await window.api.bot.start();
                }
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

    const toggleBotActive = async () => {
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
                toggleBotActive,
                updateBotSettings,
            }}
        >
            {props.children}
        </BotContext.Provider>
    );
};
