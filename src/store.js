import Store from 'electron-store';

const schema = {
    user: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
            },
            balances: {
                type: 'object',
                properties: {
                    dec: { type: 'number' },
                    sps: { type: 'number' },
                    rc: { type: 'number' },
                },
            },
        },
    },

    bot: {
        type: 'object',
        properties: {
            active: {
                type: 'boolean',
                default: false,
            },
            isLoading: {
                type: 'boolean',
                default: false,
            },
            settings: {
                type: 'object',
                properties: {
                    dailyRelistings: {
                        type: 'number',
                        minimum: 1,
                    },
                    commonNorm: {
                        type: 'number',
                        minimum: 1,
                    },
                    commonGold: {
                        type: 'number',
                        minimum: 1,
                    },
                    rareNorm: {
                        type: 'number',
                        minimum: 1,
                    },
                    rareGold: {
                        type: 'number',
                        minimum: 1,
                    },
                    epicNorm: {
                        type: 'number',
                        minimum: 1,
                    },
                    epicGold: {
                        type: 'number',
                        minimum: 1,
                    },
                    legendaryNorm: {
                        type: 'number',
                        minimum: 1,
                    },
                    legendaryGold: {
                        type: 'number',
                        minimum: 1,
                    },
                },
            },
            stats: {
                type: 'object',
                properties: {
                    startedAt: {
                        type: 'string',
                    },
                    endedAt: {
                        type: 'string',
                    },
                    numListed: {
                        type: 'number',
                        minimum: 0,
                    },
                },
            },
        },
    },
};

const defaults = {
    user: {
        balances: {
            dec: 0,
            sps: 0,
            rc: 100,
        },
    },

    bot: {
        active: false,
        isLoading: false,
        settings: {
            dailyRelistings: 1,
            commonNorm: 1,
            commonGold: 1,
            rareNorm: 1,
            rareGold: 1,
            epicNorm: 1,
            epicGold: 1,
            legendaryNorm: 1,
            legendaryGold: 1,
            commonCP: 20,
            rareCP: 40,
            epicCP: 100,
            legendaryCP: 500,
        },
        stats: {
            startedAt: '',
            endedAt: '',
            numListed: 0,
        },
    },
};

const store = new Store({ defaults });
// const store = new Store({ defaults, schema });

export default store;
