import util from '../util';
import userService from '../services/user';
const NOT_DELEGATED = 'not_delegated';
const INVALID_POSTING_KEY = 'invalid_posting_key';

const login = async (event, payload) => {
    const { username, key } = payload;

    if (!key) {
        // login with delegation authority
        const isDegelated = await userService.checkDelegationAuthority(
            username
        );
        if (!isDegelated) {
            return util.error(NOT_DELEGATED);
        }
        await userService.setUsername(username);
    } else {
        const isValidKey = await userService.isValidKey(key);
        if (!isValidKey) {
            return util.error(INVALID_POSTING_KEY);
        }
        await userService.setKey(username, key);
        await userService.setUsername(username);
    }

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
