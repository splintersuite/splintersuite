import axios from 'axios';
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
            required_posting_auths: [],
            required_auths: [username],
            id: 'sm_market_list',
            json: JSON.stringify({
                cards,
                type: 'rent',
                fee: 500,
                required_posting_auths: [],
                required_auths: [username],
            }),
        },
        key
    );
    return res;
};

// ids = market rental ids
const updateRentals = async (ids, price) => {
    const username = userService.getUsername();
    const rawKey = await userService.getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [],
            required_auths: [username],
            id: 'sm_update_price',
            json: JSON.stringify({
                ids,
                new_price: price,
                required_posting_auths: [],
                required_auths: [username],
            }),
        },
        key
    );
    return res;
};

// ids = market rental ids
const deleteRentals = async (ids) => {
    const username = userService.getUsername();
    const rawKey = await userService.getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [],
            required_auths: [username],
            id: 'sm_market_cancel_rental',
            json: JSON.stringify({
                ids,
                required_posting_auths: [],
                required_auths: [username],
            }),
        },
        key
    );
    return res;
};

export default {
    createRentals,
    updateRentals,
    deleteRentals,
};
