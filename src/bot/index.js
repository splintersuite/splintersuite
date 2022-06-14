import rentals from './server';
import util from './util';

window.api.bot.start(async (event) => {
    console.log('bot:start');

    let res = await window.api.user.get();
    const { user } = res.data;
    res = await window.api.bot.getSettings();
    const { settings } = res.data;
    res = await window.api.bot.getActive();
    let { active } = res.data;

    const duration = util.periodToMs(settings.dailyRelistings);

    while (active) {
        const { listings, relistings, cancellations } =
            await rentals.startRentalBot({ username: user.username, settings });
        await window.api.hive.createRentals({ cards: listings });
        await window.api.hive.updateRentals({
            ids: relistings,
        });
        await window.api.hive.deleteRentals({ ids: cancellations });
        await util.pause(duration);
        res = await window.api.bot.getActive();
        active = res.data.active;
    }
});

window.api.bot.stop((event) => {
    // stop bot rental process
    console.log('bot:stop');
});
