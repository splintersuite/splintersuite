import util from '../util';
import hiveService from '../services/hive';

const createRentals = async (event, payload) => {
    const { cards } = payload;

    const res = await hiveService.createRentals(cards);

    return util.success(res);
};

const updateRentals = async (event, payload) => {
    const { cards, price } = payload;

    const res = await hiveService.updateRentals(cards, price);

    return util.success(res);
};

const deleteRentals = async (event, payload) => {
    const { cards } = payload;

    const res = await hiveService.deleteRentals(cards);

    return util.success(res);
};

export default {
    createRentals,
    updateRentals,
    deleteRentals,
};
