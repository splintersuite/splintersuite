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
                    dec: 'number',
                    sps: 'number',
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
            settings: {
                type: 'object',
                properties: {
                    dailyRelistings: {
                        type: 'number',
                        minimum: 0,
                    },
                    commonNorm: {
                        type: 'number',
                        minimum: 0,
                    },
                    commonGold: {
                        type: 'number',
                        minimum: 0,
                    },
                    rareNorm: {
                        type: 'number',
                        minimum: 0,
                    },
                    rareGold: {
                        type: 'number',
                        minimum: 0,
                    },
                    epicNorm: {
                        type: 'number',
                        minimum: 0,
                    },
                    epicGold: {
                        type: 'number',
                        minimum: 0,
                    },
                    legendaryNorm: {
                        type: 'number',
                        minimum: 0,
                    },
                    legendaryGold: {
                        type: 'number',
                        minimum: 0,
                    },
                },
            },
        },
    },
};

const defaults = {
    bot: {
        active: false,
        settings: {
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
    },
};

const store = new Store({ defaults, schema });

export default store;
