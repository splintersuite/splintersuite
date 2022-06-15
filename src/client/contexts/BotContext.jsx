import React, { useContext, useEffect, useState } from 'react';

import hooks from '../hooks';

const initialState = {
    botActive: false,
    botSettings: {
        dailyRelistings: 0,
        commonNorm: 1,
        commonGold: 1,
        rareNorm: 1,
        rareGold: 1,
        epicNorm: 1,
        epicGold: 1,
        legendaryNorm: 1,
        legendaryGold: 1,
    },
    botStats: {
        startedAt: '',
        numListed: 0,
    },
};

const FIVE_MINUTES = 300000;

export const BotContext = React.createContext({ ...initialState });

export const useBot = () => useContext(BotContext);

export const BotProvider = (props) => {
    const [botActive, setBotActive] = useState(false);
    const [botSettings, setBotSettings] = useState(initialState.botSettings);
    const [botStats, setBotStats] = useState(initialState.botStats);

    const getStats = async () => {
        const res = await window.api.bot.getStats();
        if (res.code === 1) {
            setBotStats(res.data.stats);
        }
    };

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
        getStats();
    }, []);

    const toggleBotActive = async () => {
        if (botActive) {
            setBotActive(false);
            await window.api.bot.stop();
        } else {
            setBotActive(true);
            await window.api.bot.start();
            await getStats();
        }
    };

    const updateBotSettings = async (settings) => {
        setBotSettings(settings);
        await window.api.bot.updateSettings({ settings });
    };

    hooks.useInterval(async () => {
        await getStats();
    }, FIVE_MINUTES);

    return (
        <BotContext.Provider
            value={{
                ...initialState,
                botActive,
                botSettings,
                botStats,
                toggleBotActive,
                updateBotSettings,
            }}
        >
            {props.children}
        </BotContext.Provider>
    );
};
