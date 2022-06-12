import rentals from './server';

window.api.bot.start(async (event) => {
    console.log('bot:start');

    let res = await window.api.user.get();
    const { username } = res.data;
    res = await window.api.bot.getSettings();
    const { settings } = res.data;

    const cards = await rentals.startRentalBot({ username, settings });
    console.log(cards);
    res = await window.api.hive.createRentals(cards);
    console.log(res);
});

window.api.bot.stop((event) => {
    // stop bot rental process
    console.log('bot:stop');
});
