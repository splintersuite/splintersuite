import moment from 'moment';

import axios from '../util/axios';
import splinterlandsService from '../services/splinterlands';
import userService from '../services/user';

const get = async (username) => {
    const res = await axios.get(
        `${process.env.API_URL}/api/invoices/${username}`
    );
    return res.data;
};

const update = async (invoice) => {
    const res = await axios.post(
        `${process.env.API_URL}/api/invoices/${invoice.id}`,
        { paid_at: moment() }
    );
    return res.data;
};

const confirm = async (invoice) => {
    const { amount_due, created_at } = invoice;
    const invoice_created_time = new Date(created_at).getTime();
    const username = await userService.getUsername();
    const confirmIsPaid = (payment) => {
        const paymentDateTime = new Date(payment.created_date).getTime();
        return (
            payment.token === 'DEC' &&
            payment.counterparty === username &&
            payment.type === 'withdraw' &&
            parseFloat(payment.amount) === parseFloat(amount_due) &&
            paymentDateTime > invoice_created_time // TNT TODO: confirm that this actually works
        );
    };

    let isPaid = false;
    let offset = 0;
    let limit = 1000;
    while (!isPaid && limit <= 10000) {
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
