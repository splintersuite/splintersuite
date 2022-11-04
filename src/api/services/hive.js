import { Client, PrivateKey } from '@hiveio/dhive';

import userService from '../services/user';

const client = new Client([
    'https://api.hive.blog',
    'https://api.hivekings.com',
    'https://anyx.io',
    'https://api.openhive.network',
]);
const SS_key = process.env.SUITE_POST_KEY;
const SS_account_name = 'splintersuite';

const isPostingAuthDelegated = async ({ username }) => {
    const data = await client.database.getAccounts([username]);
    let delegated = false;
    const postingAccountAuths = data[0]?.posting?.account_auths;
    for (const account of postingAccountAuths) {
        if (account[0] === SS_account_name) {
            delegated = true;
            break;
        }
    }
    return delegated;
};

const createRentals = async (cards) => {
    const username = userService.getUsername();
    const delegated = isPostingAuthDelegated({ username });
    let rawKey;
    if (delegated) {
        rawKey = SS_key;
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
        rawKey = SS_key;
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
        rawKey = SS_key;
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
        rawKey = SS_key;
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
};
