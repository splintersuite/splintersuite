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
    market: {
        type: 'object',
        properties: {
            prices: {
                type: 'object',
                properties: {
                    marketPrices: { type: 'object' },
                    fetch_timestamp: { type: 'object ' }, // date
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
            cancellationMatrix: [
                { daysTillEOS: 15, cancellationThreshold: 2.0 }, // espressed as 20% on the frontend
                { daysTillEOS: 14, cancellationThreshold: 1.4 },
                { daysTillEOS: 13, cancellationThreshold: 1.0 },
                { daysTillEOS: 12, cancellationThreshold: 0.9 },
                { daysTillEOS: 11, cancellationThreshold: 0.8 },
                { daysTillEOS: 10, cancellationThreshold: 0.7 },
                { daysTillEOS: 9, cancellationThreshold: 0.6 },
                { daysTillEOS: 8, cancellationThreshold: 0.5 },
                { daysTillEOS: 7, cancellationThreshold: 0.4 },
                { daysTillEOS: 6, cancellationThreshold: 0.3 },
                { daysTillEOS: 5, cancellationThreshold: 0.2 },
                { daysTillEOS: 4, cancellationThreshold: 0.01 },
                { daysTillEOS: 3, cancellationThreshold: 0.01 },
                { daysTillEOS: 2, cancellationThreshold: 0.001 },
                { daysTillEOS: 1, cancellationThreshold: 0.001 },
            ],
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
