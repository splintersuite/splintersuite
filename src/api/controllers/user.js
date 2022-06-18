import util from '../util';
import userService from '../services/user';

const login = async (event, payload) => {
    const { username, key } = payload;

    await userService.setKey(username, key);
    await userService.setUsername(username);

    if (username) {
        await userService.fetchUser({ username });
    }

    return util.success();
};

const logout = async (event) => {
    const username = await userService.getUsername();

    await userService.removeKey(username);
    await userService.removeUsername();

    return util.success();
};

const get = async (event) => {
    const user = await userService.getUser();

    user.stats = {
        daily: {
            amount: 324,
            change: -0.0345,
        },
        weekly: {
            amount: 3124,
            change: 0.1045,
        },
        monthly: {
            amount: 30124,
            change: 0.1245,
        },
    };

    return util.success({ user });
};

const updateRentals = async (event, payload) => {
    const { rentals } = payload;

    const username = await userService.getUsername();
    await userService.updateRentals(username, rentals);

    return util.success();
};

export default { login, logout, get, updateRentals };
