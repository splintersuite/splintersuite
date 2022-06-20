import moment from 'moment';
import { sleep } from './server/_helpers.js';
import rentals from './server';
import util from './util';

window.api.bot.start(async (event) => {
    // ---
    // Get settings
    // ------------------------------------
    let userRes = await window.api.user.get();
    let activeRes = await window.api.bot.getActive();
    let settingsRes = await window.api.bot.getSettings();

    let user = userRes.data.user;
    let active = activeRes.data.active;
    let settings = settingsRes.data.settings;

    // ---
    // Get stats
    // ------------------------------------
    let numListed = 0;
    const startedAt = moment().format();
    const duration = util.periodToMs(settings.dailyRelistings);

    while (active && user.username) {
        await window.api.bot.updateLoading({ isLoading: true });

        // ---
        // Get cards
        // ------------------------------------
        const { listings, relistings, cancellations } =
            await rentals.startRentalBot({ username: user.username, settings });
        numListed += listings.length + relistings.length;

        window.api.bot.log({
            message: `Number of listings: ${listings.length}`,
        });
        window.api.bot.log({
            message: `Number of relistings: ${relistings.length}`,
        });
        window.api.bot.log({
            message: `Number of cancellations: ${cancellations.length}`,
        });

        // ---
        // List, relist, cancel
        // ------------------------------------
        Promise.all(
            listings.map(async (listingGroup) => {
                await window.api.hive.createRentals({
                    cards: listingGroup,
                });
            })
        );

        Promise.all(
            relistings.map(async (relistingGroup) => {
                await window.api.hive.updateRentals({
                    ids: relistings,
                });
            })
        );
        // const relistTx = await window.api.hive.updateRentals({
        //     ids: relistings,
        // });

        Promise.all(
            cancellations.map(async (cancelGroup) => {
                await window.api.hive.deleteRentals({
                    ids: cancelGroup,
                });
            })
        );
        // const cancelTX = await window.api.hive.deleteRentals({
        //     ids: cancellations,
        // });
        window.api.bot.log({
            message: `List transaction: ${JSON.stringify(createTx)}`,
        });
        window.api.bot.log({
            message: `Relist transaction: ${JSON.stringify(relistTx)}`,
        });
        window.api.bot.log({
            message: `Cancel transaction: ${JSON.stringify(cancelTX)}`,
        });
        // sleep for 10 seconds to let collection endpoint update with listings + relistings
        await sleep(10000);
        // const { rentalListings } = await rentals.updatedRentalListingsToSend({
        //     username: user.username,
        //     users_id: user.id,
        //     listings,
        //     relistings,
        // });
        await window.api.user.updateRentalListings({ rentalListings });

        // ---
        // Update stats
        // ------------------------------------
        await window.api.bot.updateStats({
            stats: {
                startedAt,
                numListed,
            },
        });
        await window.api.bot.updateLoading({ isLoading: false });

        // ---
        // Pause
        // ------------------------------------
        window.api.bot.log({
            message: `Pause for: ${util.getHours(duration)} hours`,
        });
        await sleep(duration);

        // ---
        // Update settings
        // ------------------------------------
        userRes = await window.api.user.get();
        activeRes = await window.api.bot.getActive();
        settingsRes = await window.api.bot.getSettings();

        user = userRes.data.user;
        active = activeRes.data.active;
        settings = settingsRes.data.settings;
    }
});

window.api.bot.stop((event) => {
    // stop bot rental process
});
