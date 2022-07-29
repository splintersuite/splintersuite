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
    const duration = !Number.isFinite(util.periodToMs(settings.dailyRelistings))
        ? util.periodToMs(1)
        : util.periodToMs(settings.dailyRelistings);

    while (active && user.username === username && !user.locked) {
        let nextBotLoopTime = util.getNextRunTime(duration);
        await window.api.bot.updateLoading({ isLoading: true });
        let marketRes = await window.api.market
            .getMarketPrices()
            .catch((err) => {
                window.api.bot.log({
                    message: `getMarketPrices error: ${err.message}`,
                });
                throw err;
            });
        console.log(
            `we got marketPrices, marketRes: ${JSON.stringify(marketRes)}`
        );
        let marketPrices = {};
        if (marketRes.code === 1 && marketRes?.data?.marketPrices) {
            console.log(`marketRes.code === 1 if statement called`);
            marketPrices = marketRes.data.marketPrices;
        }
        // ---
        // Get cards
        // ------------------------------------
        console.log(
            `about to call rentals.startRentalBot with marketPrices: ${JSON.stringify(
                marketPrices
            )}`
        );
        const { listings, relistings, cancellations } =
            await rentals.startRentalBot({
                username,
                settings,
                marketPrices,
                nextBotLoopTime,
            });
        // process.exit();
        // ---
        // List, relist, cancel
        // ------------------------------------
        for (const listingGroup of listings) {
            if (hiveTransactions % 4 === 0) {
                await sleep(4000);
            }
            if (listingGroup.length > 0) {
                await window.api.hive.createRentals({
                    cards: listingGroup,
                });
                console.log('listingGroup', listingGroup);
                hiveTransactions = hiveTransactions + 1;
                numListed += listingGroup.length;
            }
        }

        let listingsNum = numListed;
        window.api.bot.log({
            message: `Number of listings: ${listingsNum}`,
        });

        for (const relistingGroup of relistings) {
            if (hiveTransactions % 4 === 0) {
                await sleep(4000);
            }
            if (relistingGroup.length > 0) {
                await window.api.hive.updateRentals({
                    cards: relistingGroup,
                });
                console.log('relistingGroup', relistingGroup);
                hiveTransactions = hiveTransactions + 1;
                numListed += relistingGroup.length;
            }
        }

        listingsNum = numListed - listingsNum;
        window.api.bot.log({
            message: `Number of relistings: ${listingsNum}`,
        });

        for (const cancelGroup of cancellations) {
            if (hiveTransactions % 4 === 0) {
                await sleep(4000);
            }
            if (cancelGroup.length > 0) {
                await window.api.hive.deleteRentals({
                    cards: cancelGroup,
                });
                hiveTransactions = hiveTransactions + 1;
            }
        }

        listingsNum = 0;
        hiveTransactions = 0;

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
