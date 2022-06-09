const start = ({ username, key }) => {
    console.log('BOT: start rentals');
    console.log(username, key);
};

const stop = ({ username, key }) => {
    console.log('BOT: stop rentals');
    console.log(username, key);
};

export default {
    start,
    stop,
};
