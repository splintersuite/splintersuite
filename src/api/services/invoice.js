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

const update = async (invoice, tx_id, paid_at) => {
    const res = await axios.post(
        `${process.env.API_URL}/api/invoices/${invoice.id}`,
        { paid_at, tx_id }
    );
    return res.data;
};

const confirm = async (invoice) => {
    const { amount_due, created_at } = invoice;
    const invoice_created_time = new Date(created_at).getTime();
    const username = await userService.getUsername();
    let isPaid = false;
    let offset = 0;
    let limit = 1000;
    let tx_id;
    let paid_at;
    while (!isPaid && limit <= 10000) {
        const payments = await splinterlandsService.getPaymentHistory(
            offset,
            limit
        );

        for (const payment of payments) {
            const paymentDateTime = new Date(payment.created_date).getTime();
            if (
                payment.token === 'DEC' &&
                payment.counterparty === username &&
                payment.type === 'withdraw' &&
                parseFloat(payment.amount) === parseFloat(amount_due) &&
                paymentDateTime > invoice_created_time
            ) {
                isPaid = true;
                tx_id = payment.trx_id;
                paid_at = new Date(payment.created_date);
            }
        }
        offset = limit;
        limit += 1000;
    }

    return { isPaid, tx_id, paid_at };
};

export default {
    get,
    update,
    confirm,
};
