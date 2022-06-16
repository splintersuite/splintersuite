import util from '../util';
import invoiceService from '../services/invoice';

const get = async () => {};

const update = async () => {
    await invoiceService.update();
    return util.success();
};

const confirm = async (event, payload) => {
    const { invoice } = payload;

    const isPaid = await invoiceService.confirm(invoice);

    if (isPaid) {
        console.log('UPDATING INVOICE');
        await invoiceService.update(invoice);
    }

    return util.success({ isPaid });
};

export default {
    get,
    update,
    confirm,
};
