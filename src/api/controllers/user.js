import util from '../util';
import userService from '../services/user';

const login = async (event, payload) => {
    const { username, key } = payload;

    userService.setKey(username, key);
    userService.setUsername(username);

    if (username) {
        userService.fetchUserData({ username });
    }

    return util.success();
};

const logout = async (event) => {
    const username = userService.getUsername();

    userService.removeKey(username);
    userService.removeUsername();

    return util.success();
};

const get = (event) => {
    const username = userService.getUsername();
    return util.success({ username });
};

export default { login, logout, get };
