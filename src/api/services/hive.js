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

const updateRentals = async (ids, price) => {
    const username = userService.getUsername();
    const rawKey = await userService.getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [],
            required_auths: [username],
            id: 'sm_update_rental_price',
            json: JSON.stringify({
                items: ids,
                //new_price: price,
                required_posting_auths: [],
                required_auths: [username],
            }),
        },
        key
    );
    return res;
};

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
                items: ids,
                required_posting_auths: [],
                required_auths: [username],
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
    getRc,
};
