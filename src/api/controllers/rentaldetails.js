import util from '../util';
import relistingsService from '../services/rentaldetails';

const getRentalDetails = (event, payload) => {
    const rentalDetails = relistingsService.getRentalDetails();
    return util.success({ rentalDetails });
};

const updateRentalDetails = (event, payload) => {
    const { rentalDetails } = payload;
    console.log('/controllers/updateRentalDetails start');
    relistingsService.updateRentalDetails({ data: rentalDetails });
    return util.success();
};

export default {
    updateRentalDetails,
    getRentalDetails,
};
