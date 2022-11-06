import { Client, PrivateKey } from '@hiveio/dhive';

import userService from '../services/user';
import ecc from 'eosjs-ecc';

const client = new Client([
    'https://api.hive.blog',
    'https://api.hivekings.com',
    'https://anyx.io',
    'https://api.openhive.network',
]);

const SS_KEY = process.env.SUITE_POST_KEY;
const SS_ACCOUNT_NAME = 'splintersuite';

const isPostingAuthDelegated = async ({ username }) => {
    const data = await client.database.getAccounts([username]);
    const postingAccountAuths = data[0]?.posting?.account_auths;
    if (Array.isArray(postingAccountAuths) && postingAccountAuths.length > 0) {
        return postingAccountAuths.some(
            (account) => account[0] === SS_ACCOUNT_NAME
        );
    } else {
        return false;
    }
};

const isValidPostingKey = async (key) => {
    return await ecc.isValidPrivate(key);
};

const createRentals = async (cards) => {
    const username = userService.getUsername();
    const delegated = isPostingAuthDelegated({ username });
    let rawKey;
    if (delegated) {
        rawKey = SS_KEY;
    } else {
        rawKey = await userService.getKey(username);
    }
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
    const username = userService.getUsername();
    const delegated = isPostingAuthDelegated({ username });
    let rawKey;
    if (delegated) {
        rawKey = SS_KEY;
    } else {
        rawKey = await userService.getKey(username);
    }
    //const rawKey = await userService.getKey(username);
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
    const username = userService.getUsername();
    const delegated = isPostingAuthDelegated({ username });
    let rawKey;
    if (delegated) {
        rawKey = SS_KEY;
    } else {
        rawKey = await userService.getKey(username);
    }
    //const rawKey = await userService.getKey(username);
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
    const username = userService.getUsername();
    const delegated = isPostingAuthDelegated({ username });
    let rawKey;
    if (delegated) {
        rawKey = SS_KEY;
    } else {
        rawKey = await userService.getKey(username);
    }
    //  const rawKey = await userService.getKey(username);
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
