import keytar from 'keytar';

import util from '../util';
import store from '../../store';
import botService from '../services/bot';

// Public
// ===========================

const login = async (event, payload) => {
    const { username, key } = payload;

    _setKey(username, key);
    _setUsername(username);

    return util.success();
};

const start = async (event) => {
    const username = _getUsername();
    const key = await _getKey(username);

    botService.start({ username, key });

    return util.success();
};

const stop = async (event) => {
    const username = _getUsername();
    const key = await _getKey(username);

    botService.stop({ username, key });

    return util.success();
};

// Private
// ===========================

const _setUsername = (username) => {
    return store.set('username', username);
};

const _getUsername = () => {
    return store.get('username');
};

const _setKey = (username, key) => {
    return keytar.setPassword('splintersuite', username, key);
};

const _getKey = (username) => {
    return keytar.getPassword('splintersuite', username);
};

export default { login, start, stop };
