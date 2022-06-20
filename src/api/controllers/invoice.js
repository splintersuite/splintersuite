import util from '../util';
import invoiceService from '../services/invoice';
import userService from '../services/user';

const get = async () => {};

const update = async () => {
    await invoiceService.update();
    return util.success();
};

const confirm = async (event, payload) => {
    const { invoice } = payload;

    const isPaid = await invoiceService.confirm(invoice);

    if (isPaid) {
        const { locked } = await invoiceService.update(invoice);
        userService.setLocked(locked);
    }

    return util.success({ isPaid });
};

export default {
    get,
    update,
    confirm,
};
