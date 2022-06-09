import Store from 'electron-store';

const schema = {
    username: {
        type: 'string',
    },
    bot: {
        active: {
            type: 'boolean',
        },
        settings: {
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
                min: 0,
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
                min: 0,
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
                min: 0,
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
                min: 0,
            },
        },
    },
};
const store = new Store({ schema });

export default store;
