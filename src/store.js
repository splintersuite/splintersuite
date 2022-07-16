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
                { days_till_eos: 15, cancellation_threshold: 2.0 }, // espressed as 20% on the frontend
                { days_till_eos: 14, cancellation_threshold: 1.4 },
                { days_till_eos: 13, cancellation_threshold: 1.0 },
                { days_till_eos: 12, cancellation_threshold: 0.9 },
                { days_till_eos: 11, cancellation_threshold: 0.8 },
                { days_till_eos: 10, cancellation_threshold: 0.7 },
                { days_till_eos: 9, cancellation_threshold: 0.6 },
                { days_till_eos: 8, cancellation_threshold: 0.5 },
                { days_till_eos: 7, cancellation_threshold: 0.4 },
                { days_till_eos: 6, cancellation_threshold: 0.3 },
                { days_till_eos: 5, cancellation_threshold: 0.2 },
                { days_till_eos: 4, cancellation_threshold: 0.01 },
                { days_till_eos: 3, cancellation_threshold: 0.01 },
                { days_till_eos: 2, cancellation_threshold: 0.001 },
                { days_till_eos: 1, cancellation_threshold: 0.001 },
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
