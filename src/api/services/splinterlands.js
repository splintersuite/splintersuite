import axios from '../util/axios';

const getBalance = async (username) => {
    let res = await axios('https://api2.splinterlands.com/players/balances', {
        params: {
            username,
        },
    });

    let dec, sps;
    res.data.map((item) => {
        if (item.token === 'DEC') {
            dec = Math.round(item.balance);
        } else if (item.token === 'SPS') {
            sps = Math.round(item.balance);
        }
    });

    return { dec, sps };
};

const getPaymentHistory = async (username) => {
    let res = await axios(
        'https://api2.splinterlands.com/players/balance_history',
        {
            params: {
                username,
                token_type: 'DEC',
            },
        }
    );
    return res.data;
};

export default { getBalance, getPaymentHistory };
