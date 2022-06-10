import Store from 'electron-store';

const schema = {
    username: {
        type: 'string',
    },
    bot: {
        type: 'object',
        default: {},
        properties: {
            active: {
                type: 'boolean',
                default: false,
            },
            settings: {
                type: 'object',
                properties: {
                    listPrice: {
                        type: 'string',
                        enum: ['lowest', 'average'],
                        default: 'average',
                    },
                    monstersRegularUnit: {
                        type: 'string',
                        enum: ['cp', 'level'],
                        default: 'level',
                    },
                    monstersRegularOperator: {
                        type: 'string',
                        enum: ['gt', 'et', 'lt'],
                        default: 'gt',
                    },
                    monstersRegularAmount: {
                        type: 'number',
                        minimum: 0,
                        default: 0,
                    },
                    monstersGoldUnit: {
                        type: 'string',
                        enum: ['cp', 'level'],
                        default: 'level',
                    },
                    monstersGoldOperator: {
                        type: 'string',
                        enum: ['gt', 'et', 'lt'],
                        default: 'gt',
                    },
                    monstersGoldAmount: {
                        type: 'number',
                        minimum: 0,
                        default: 0,
                    },
                    summonersRegularUnit: {
                        type: 'string',
                        enum: ['cp', 'level'],
                        default: 'level',
                    },
                    summonersRegularOperator: {
                        type: 'string',
                        enum: ['gt', 'et', 'lt'],
                        default: 'gt',
                    },
                    summonersRegularAmount: {
                        type: 'number',
                        minimum: 0,
                        default: 0,
                    },
                    summonersGoldUnit: {
                        type: 'string',
                        enum: ['cp', 'level'],
                        default: 'level',
                    },
                    summonersGoldOperator: {
                        type: 'string',
                        enum: ['gt', 'et', 'lt'],
                        default: 'gt',
                    },
                    summonersGoldAmount: {
                        type: 'number',
                        minimum: 0,
                        default: 0,
                    },
                },
            },
        },
    },
};
const store = new Store({ schema });

export default store;
