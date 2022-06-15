import util from '../util';
import invoiceService from '../services/invoice';

const get = async () => {};

const update = async () => {
    await invoiceService.update();
    return util.success();
};

export default {
    get,
    update,
};
