import store from '../../store';
import axios from '../util/axios';

const get = async (username) => {
    const invoices = await axios.get(
        `${process.env.SERVER_URL}/invoices/${username}`
    );
    return invoices;
};

const update = () => {
    console.log('MARK INVOICE AS PAID');
    console.log(
        '---------------------------------------------------------------------------'
    );
};

export default {
    get,
    update,
};
