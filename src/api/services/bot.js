import store from '../../store';
import userService from '../services/user';

const start = async () => {
    const username = userService.getUsername();
    const key = await userService.getKey(username);

    console.log('BOT: start rentals');
    console.log(username, key);
};

const stop = async () => {
    const username = userService.getUsername();
    const key = await userService.getKey(username);

    console.log('BOT: stop rentals');
    console.log(username, key);
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
};
