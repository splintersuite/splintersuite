import util from '../util';
import userService from '../services/user';
import hiveService from '../services/hive';
const NOT_DELEGATED = 'not_delegated';
const INVALID_POSTING_KEY = 'invalid_posting_key';

const login = async (event, payload) => {
    const { username, key } = payload;

    if (!key) {
        const isDegelated = await hiveService.isPostingAuthDelegated(username);
        if (!isDegelated) {
            return util.error(NOT_DELEGATED);
        }
        await userService.setUsername(username);
    } else {
        const isValidKey = await hiveService.isValidPostingKey(key, username);
        if (!isValidKey) {
            return util.error(INVALID_POSTING_KEY);
        }
        await userService.setKey(username, key);
        await userService.setUsername(username);
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
