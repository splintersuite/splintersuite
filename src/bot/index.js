import moment from 'moment';
import { sleep } from './actions/_helpers.js';
import rentals from './server';
import util from './util';

window.api.bot.start(async (event) => {
    console.log('bot:start');

    let userRes = await window.api.user.get();
    let activeRes = await window.api.bot.getActive();
    let settingsRes = await window.api.bot.getSettings();

    let user = userRes.data.user;
    let active = activeRes.data.active;
    let settings = settingsRes.data.settings;

    let numListed = 0;
    const startedAt = moment().format();
    const duration = util.periodToMs(settings.dailyRelistings);

    while (active && user.username) {
        await window.api.bot.updateLoading({ isLoading: true });

        const { listings, relistings, cancellations } =
            await rentals.startRentalBot({ username: user.username, settings });
        numListed += listings.length + relistings.length;

        await window.api.hive.createRentals({ cards: listings });
        await window.api.hive.updateRentals({
            ids: relistings,
        });
        await window.api.hive.deleteRentals({ ids: cancellations });

        // sleep for 10 seconds to let collection endpoint update with listings + relistings
        await sleep(10000);
        // we should wait like 20 seconds for everything to update before sending the data to back-end.
        // VALID RENTALS REQUEST
        // await window.api.user.updateRentals({
        //     rentals: [{ id: 1 }],
        // });

        await window.api.bot.updateStats({
            stats: {
                startedAt,
                numListed,
            },
        });
        await window.api.bot.updateLoading({ isLoading: false });

        await util.pause(duration);

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
    console.log('bot:stop');
});
