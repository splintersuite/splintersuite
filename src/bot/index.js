import rentals from './server';
import util from './util';

window.api.bot.start(async (event) => {
    console.log('bot:start');

    let res = await window.api.user.get();
    const { username } = res.data;
    res = await window.api.bot.getSettings();
    const { settings } = res.data;
    res = await window.api.bot.getActive();
    let { active } = res.data;

    const duration = util.periodToMs(settings.dailyRelistings);

    while (active) {
        const cards = await rentals.startRentalBot({ username, settings });
        await window.api.hive.createRentals({ cards });

        await util.pause(duration);

        res = await window.api.bot.getActive();
        active = res.data.active;
    }
});

window.api.bot.stop((event) => {
    // stop bot rental process
    console.log('bot:stop');
});
