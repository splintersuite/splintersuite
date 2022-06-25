// unfortunately rentalPriceForUid comes in [uid, price] terms not [uid] = price
const checkPricing = async ({ rentalPriceForUid }) => {
    rentalPriceForUid.forEach((items) => {
        // lookup in cache or splinterlands API
        // fix issues 1 and 2
    });
};

module.exports = {
    checkPricing,
};
