import moment from 'moment';

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
        const createTx = await window.api.hive.createRentals({
            cards: listings,
        });
        const relistTx = await window.api.hive.updateRentals({
            ids: relistings,
        });
        const cancelTX = await window.api.hive.deleteRentals({
            ids: cancellations,
        });
        window.api.bot.log({
            message: `List transaction: ${createTx}`,
        });
        window.api.bot.log({
            message: `Relist transaction: ${relistTx}`,
        });
        window.api.bot.log({
            message: `Cancel transaction: ${cancelTX}`,
        });

        // VALID RENTALS REQUEST
        // await window.api.user.updateRentals({
        //     rentals: [{ id: 1 }],
        // });

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
        await util.pause(duration);

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
