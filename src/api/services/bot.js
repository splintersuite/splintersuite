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

export default {
    start,
    stop,
};
