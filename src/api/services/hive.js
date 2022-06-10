import axios from 'axios';
import { Client, PrivateKey } from '@hiveio/dhive';

const hiveTest = async () => {
    const client = new Client([
        'https://api.hive.blog',
        'https://api.hivekings.com',
        'https://anyx.io',
        'https://api.openhive.network',
    ]);

    const key = PrivateKey.from();
    // const key = PrivateKey.fromLogin("username", "password", "posting");

    // hive.broadcast.claimRewardBalance(
    //     wif,
    //     account,
    //     reward_hive,
    //     reward_hbd,
    //     reward_vests,
    //     callback
    // );

    const res = await client.broadcast.json(
        {
            required_posting_auths: [],
            required_auths: ['chigginn'],
            id: 'sm_market_list',
            json: JSON.stringify({
                cards: [['C3-331-20B93BXDG0', 200]],
                type: 'rent',
                fee: 500,
                required_posting_auths: [],
                required_auths: ['chigginn'],
            }),
        },
        key
    );
    console.log('RESULT');
    console.log('-------------------------------');
    console.log(res);
    console.log('-------------------------------');
};

export default {
    hiveTest,
};
