import util from '../util';
import invoiceService from '../services/invoice';
import userService from '../services/user';

const get = async () => {};

const update = async () => {};

const confirm = async (event, payload) => {
    const { invoice } = payload;

    const { isPaid, tx_id, paid_at } = await invoiceService.confirm(invoice);

    if (isPaid) {
        const { locked } = await invoiceService.update(invoice, tx_id, paid_at);
        userService.setLocked(locked);
    }

    return util.success({ isPaid });
};

export default {
    get,
    update,
    confirm,
};
