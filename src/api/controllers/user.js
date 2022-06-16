import util from '../util';
import userService from '../services/user';

const login = async (event, payload) => {
    const { username, key } = payload;

    userService.setKey(username, key);
    userService.setUsername(username);

    if (username) {
        userService.fetchUser({ username });
    }

    return util.success();
};

const logout = async (event) => {
    const username = userService.getUsername();

    userService.removeKey(username);
    userService.removeUsername();

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

export default { login, logout, get };
