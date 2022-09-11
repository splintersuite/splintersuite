const updateRentalsStore = ({
    rentalDetailsObj,
    activeListingsObj,
    activeRentals,
    // price update object?
}) => {
    try {
        // continue with adding here...
        activeRentals.forEach((rental) => {
            if (rentalDetailsObj[rental.card_uid] === undefined) {
                rentalDetailsObj[rental.card_uid] = { is_rented: true };
            }
        });
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/rentalDetails/updateRentals error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    updateRentalsStore,
};

// is_rented: {
//     type: 'boolean',
// },
// last_rental_payment: {
//     type: 'date',
// },
// last_price_update: {
//     type: 'date',
// },
