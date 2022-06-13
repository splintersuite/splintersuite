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
    // const username = userService.getUsername();
    return util.success({ user });
};

export default { login, logout, get };
