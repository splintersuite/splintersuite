import { Client, PrivateKey } from '@hiveio/dhive';

import userService from '../services/user';
import ecc from 'eosjs-ecc';

const client = new Client([
    'https://api.hive.blog',
    'https://api.hivekings.com',
    'https://anyx.io',
    'https://api.openhive.network',
]);

const isPostingAuthDelegated = async (username) => {
    const data = await client.database.getAccounts([username]);
    if (Array.isArray(data) && data.length > 0) {
        const postingAccountAuths = data[0]?.posting?.account_auths;
        if (
            Array.isArray(postingAccountAuths) &&
            postingAccountAuths.length > 0
        ) {
            return postingAccountAuths.some(
                (account) => account[0] === process.env.SUITE_ACCOUNT_NAME
            );
        }
    }
    return false;
};

const getKey = async (username) => {
    const isDelegated = await isPostingAuthDelegated(username);
    let rawKey;
    if (isDelegated) {
        rawKey = process.env.SUITE_POST_KEY;
    } else {
        rawKey = await userService.getKey(username);
    }
    return rawKey;
};

const isValidPostingKey = async (key) => {
    return await ecc.isValidPrivate(key);
};

const createRentals = async (cards) => {
    const username = await userService.getUsername();
    const rawKey = await getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [username],
            required_auths: [],
            id: 'sm_market_list',
            json: JSON.stringify({
                cards,
                type: 'rent',
                fee: 500,
                agent: 'splintersuite',
            }),
        },
        key
    );
    return res;
};

const updateRentals = async (cards) => {
    const username = await userService.getUsername();
    const rawKey = await getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [username],
            required_auths: [],
            id: 'sm_update_rental_price',
            json: JSON.stringify({
                items: cards,
                agent: 'splintersuite',
                suite_action: 'relist',
            }),
        },
        key
    );
    return res;
};

const relistActiveRentals = async (cards) => {
    const username = await userService.getUsername();
    const rawKey = await getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [username],
            required_auths: [],
            id: 'sm_update_rental_price',
            json: JSON.stringify({
                items: cards,
                agent: 'splintersuite',
                suite_action: 'cancel',
            }),
        },
        key
    );
    return res;
};

const deleteRentals = async (cards) => {
    const username = await userService.getUsername();
    const rawKey = await getKey(username);
    const key = PrivateKey.from(rawKey);

    const res = await client.broadcast.json(
        {
            required_posting_auths: [username],
            required_auths: [],
            id: 'sm_market_cancel_rental',
            json: JSON.stringify({
                items: cards,
                agent: 'splintersuite',
                suite_action: 'cancel',
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
    isPostingAuthDelegated,
    isValidPostingKey,
};
