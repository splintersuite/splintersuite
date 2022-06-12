import store from '../../store';
import userService from '../services/user';
import hiveService from '../services/hive';

const start = async () => {
    // const username = userService.getUsername();
    // const key = await userService.getKey(username);

    console.log('BOT: start rentals');
    // await hiveService.postRentals([['C3-331-L9ICDKTJQO', 500]]);
    // await hiveService.updateRentals(
    //     ['310bac61ac6a4d35daaef557ceba4cf6bd8bd165'],
    //     300
    // );
};

const stop = async () => {
    const username = userService.getUsername();
    const key = await userService.getKey(username);

    console.log('BOT: stop rentals');
};

const getActive = () => {
    return store.get('bot.active');
};

const setActive = (active) => {
    return store.set('bot.active', active);
};

const getSettings = async () => {
    return store.get('bot.settings');
};

const setSettings = (settings) => {
    return store.set('bot.settings', settings);
};

export default {
    start,
    stop,
    getActive,
    setActive,
    getSettings,
    setSettings,
};
