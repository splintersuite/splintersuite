import React, { useContext, useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import hooks from '../hooks';
import { useUser } from './UserContext.jsx';

const initialState = {
    botActive: false,
    botLoading: false,
    botSettings: {
        dailyRelistings: 1,
        commonNorm: 1,
        commonGold: 1,
        rareNorm: 1,
        rareGold: 1,
        epicNorm: 1,
        epicGold: 1,
        legendaryNorm: 1,
        legendaryGold: 1,
        commonCP: 0,
        rareCP: 0,
        epicCP: 0,
        legendaryCP: 0,
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
    const [botLoading, setBotLoading] = useState(initialState.botLoading);
    const { username } = useUser();

    const getStats = async () => {
        const res = await window.api.bot.getStats();
        if (res.code === 1) {
            setBotStats(res.data.stats);
        }
    };

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
        console.log(res.data.settings);
    };

    const getLoading = async () => {
        const res = await window.api.bot.getLoading();
        if (res.code === 1) {
            setBotLoading(res.data.isLoading);
        }
    };

    const updateBotSettings = async (settings) => {
        setBotSettings(settings);
        await window.api.bot.updateSettings({ settings });
        showNotification({
            icon: <FontAwesomeIcon icon={faCircleCheck} />,
            message: 'Settings Saved.',
            color: 'teal',
        });
    };

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

    const stopBot = async () => {
        setBotActive(false);
        await window.api.bot.stop();
    };

    useEffect(() => {
        stopBot();
    }, []);

    useEffect(() => {
        getActive();
        getSettings();
        getStats();
    }, [username]);

    useEffect(() => {
        getStats();
    }, [botActive]);

    hooks.useInterval(async () => {
        await getStats();
    }, FIVE_MINUTES);

    window.api.bot.updateLoading((event, payload) => {
        const { isLoading } = payload;
        setBotLoading(isLoading);
    });

    return (
        <BotContext.Provider
            value={{
                ...initialState,
                botActive,
                botSettings,
                botStats,
                botLoading,
                toggleBotActive,
                updateBotSettings,
                getLoading,
            }}
        >
            {props.children}
        </BotContext.Provider>
    );
};
