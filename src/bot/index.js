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
    let hiveTransactions = 0;
    const username = user.username;

    // ---
    // Get stats
    // ------------------------------------
    let numListed = 0;
    const startedAt = moment().format();
    const duration = util.periodToMs(settings.dailyRelistings);

    while (active && user.username === username && !user.locked) {
        await window.api.bot.updateLoading({ isLoading: true });

        // ---
        // Get cards
        // ------------------------------------
        const { listings, relistings, cancellations } =
            await rentals.startRentalBot({
                username,
                settings,
            });

        // ---
        // List, relist, cancel
        // ------------------------------------
        if (listings.length > 0) {
            for (const listingGroup of listings) {
                if (hiveTransactions % 4 === 0) {
                    await sleep(4000);
                }
                await window.api.hive.createRentals({
                    cards: listingGroup,
                });
                hiveTransactions = hiveTransactions + 1;
                numListed += listingGroup.length;
            }
        }

        let listingsNum = numListed;
        window.api.bot.log({
            message: `Number of listings: ${listingsNum}`,
        });

        if (relistings.length > 0) {
            for (const relistingGroup of relistings) {
                if (hiveTransactions % 4 === 0) {
                    await sleep(4000);
                }
                await window.api.hive.updateRentals({
                    cards: relistingGroup,
                });
                hiveTransactions = hiveTransactions + 1;
                numListed += relistingGroup.length;
            }
        }

        listingsNum = numListed - listingsNum;
        window.api.bot.log({
            message: `Number of relistings: ${listingsNum}`,
        });

        if (cancellations.length > 0) {
            for (const cancelGroup of cancellations) {
                if (hiveTransactions % 4 === 0) {
                    await sleep(4000);
                }
                await window.api.hive.deleteRentals({
                    cards: cancelGroup,
                });
                hiveTransactions = hiveTransactions + 1;
            }
        }

        listingsNum = 0;
        hiveTransactions = 0;

        window.api.bot.log({ message: 'sleeping for 10 seconds' });

        await sleep(10000);

        const { rentalListings } = await rentals.updatedRentalListingsToSend({
            username,
            users_id: user.id,
            listings,
            relistings,
        });
        await window.api.user.updateRentalListings({ rentalListings });

        // ---
        // Update stats
        // ------------------------------------
        await window.api.bot.updateStats({
            stats: {
                startedAt,
                endedAt: moment().format(),
                numListed,
            },
        });
        await window.api.bot.updateLoading({ isLoading: false });

        // ---
        // Sleep
        // ------------------------------------
        window.api.bot.log({
            message: `Sleep for: ${util.getHours(duration)} hours`,
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

    await window.api.bot.updateStats({
        stats: {
            startedAt,
            endedAt: moment().format(),
            numListed,
        },
    });
});

window.api.bot.stop((event) => {
    // stop bot rental process
});
