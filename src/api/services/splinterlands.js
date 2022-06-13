import axios from '../util/axios';
import userService from '../services/user';

const getBalance = async () => {
    const username = userService.getUsername();

    const res = await axios('https://api2.splinterlands.com/players/balances', {
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

    userService.setBalances(dec, sps);
};

export default { getBalance };
