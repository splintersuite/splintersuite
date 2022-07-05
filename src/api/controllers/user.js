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
    await userService.clear();

    return util.success();
};

const get = async (event) => {
    const user = await userService.getUser();

    return util.success({ user });
};

export default { login, logout, get };
