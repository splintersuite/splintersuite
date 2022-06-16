import moment from 'moment';

import store from '../../store';
import axios from '../util/axios';
import splinterlandsService from '../services/splinterlands';
import userService from '../services/user';

const get = async (username) => {
    const invoices = await axios.get(
        `${process.env.SERVER_URL}/invoices/${username}`
    );
    return invoices;
};

const update = () => {};

const confirm = async (invoice) => {
    const { amount, due } = invoice;
    const username = await userService.getUsername();

    const confirmIsPaid = (payment) => {
        return (
            payment.token === 'DEC' &&
            payment.counterparty === username &&
            payment.type === 'withdraw' &&
            parseFloat(payment.amount) === amount
        );
    };

    let isPaid = false;
    let offset = 0;
    let limit = 1000;
    while ((!isPaid, limit <= 10000)) {
        const payments = await splinterlandsService.getPaymentHistory(
            offset,
            limit
        );
        isPaid = payments.some(confirmIsPaid);

        offset = limit;
        limit += 1000;
    }

    return isPaid;
};

export default {
    get,
    update,
    confirm,
};
