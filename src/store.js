import Store from 'electron-store';

const schema = {
    username: {
        type: 'string',
    },
    bot: {
        type: 'object',
        properties: {
            active: {
                type: 'boolean',
            },
            settings: {
                type: 'object',
                properties: {
                    listPrice: {
                        type: 'string',
                        enum: ['lowest', 'average'],
                    },
                    monstersRegularUnit: {
                        type: 'string',
                        enum: ['cp', 'bcx', 'level'],
                    },
                    monstersRegularOperator: {
                        type: 'string',
                        enum: ['gt', 'et', 'lt'],
                    },
                    monstersRegularAmount: {
                        type: 'number',
                        minimum: 0,
                    },
                    monstersGoldUnit: {
                        type: 'string',
                        enum: ['cp', 'bcx', 'level'],
                    },
                    monstersGoldOperator: {
                        type: 'string',
                        enum: ['gt', 'et', 'lt'],
                    },
                    monstersGoldAmount: {
                        type: 'number',
                        minimum: 0,
                    },
                    summonersRegularUnit: {
                        type: 'string',
                        enum: ['cp', 'bcx', 'level'],
                    },
                    summonersRegularOperator: {
                        type: 'string',
                        enum: ['gt', 'et', 'lt'],
                    },
                    summonersRegularAmount: {
                        type: 'number',
                        minimum: 0,
                    },
                    summonersGoldUnit: {
                        type: 'string',
                        enum: ['cp', 'bcx', 'level'],
                    },
                    summonersGoldOperator: {
                        type: 'string',
                        enum: ['gt', 'et', 'lt'],
                    },
                    summonersGoldAmount: {
                        type: 'number',
                        minimum: 0,
                    },
                },
            },
        },
    },
};
const store = new Store({ schema });

export default store;
