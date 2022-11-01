import { Client, PrivateKey } from '@hiveio/dhive';

import userService from '../services/user';

const client = new Client([
    'https://api.hive.blog',
    'https://api.hivekings.com',
    'https://anyx.io',
    'https://api.openhive.network',
]);

const createRentals = async (cards) => {
    const username = userService.getUsername();
    const rawKey = await userService.getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [username],
            // required_posting_auths: ['splintersuite'],
            required_auths: [],
            id: 'sm_market_list',
            json: JSON.stringify({
                cards,
                type: 'rent',
                fee: 500,
                agent: 'splintersuite',
                required_posting_auths: [username],
                required_auths: [],
            }),
        },
        key
    );
    return res;
};

const updateRentals = async (cards) => {
    const username = userService.getUsername();
    const rawKey = await userService.getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [username],
            // required_posting_auths: ['splintersuite'],
            required_auths: [],
            id: 'sm_update_rental_price',
            json: JSON.stringify({
                items: cards,
                agent: 'splintersuite',
                suite_action: 'relist',
                required_posting_auths: [username],
                required_auths: [],
            }),
        },
        key
    );
    return res;
};

const relistActiveRentals = async (cards) => {
    const username = userService.getUsername();
    const rawKey = await userService.getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [username],
            // required_posting_auths: ['splintersuite'],
            required_auths: [],
            id: 'sm_update_rental_price',
            json: JSON.stringify({
                items: cards,
                agent: 'splintersuite',
                suite_action: 'cancel',
                required_posting_auths: [username],
                required_auths: [],
            }),
        },
        key
    );
    return res;
};

const deleteRentals = async (cards) => {
    const username = userService.getUsername();
    const rawKey = await userService.getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [username],
            // required_posting_auths: ['splintersuite'],
            required_auths: [],
            id: 'sm_market_cancel_rental',
            json: JSON.stringify({
                items: cards,
                agent: 'splintersuite',
                suite_action: 'cancel',
                required_posting_auths: [username],
                required_auths: [],
            }),
        },
        key
    );
    return res;
};

const getRc = async (username) => {
    const res = await client.rc.getRCMana(username);
    return Math.round(res.percentage * 0.01);
};

export default {
    createRentals,
    updateRentals,
    deleteRentals,
    relistActiveRentals,
    getRc,
};
