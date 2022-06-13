import keytar from 'keytar';

import store from '../../store';

const getUser = () => {
    return store.get('user');
};

const setUsername = (username) => {
    return store.set('user.username', username);
};

const getUsername = () => {
    return store.get('user.username');
};

const removeUsername = () => {
    return store.delete('user.username');
};

const setKey = (username, key) => {
    return keytar.setPassword('splintersuite', username, key);
};

const getKey = (username) => {
    return keytar.getPassword('splintersuite', username);
};

const removeKey = (username) => {
    return keytar.deletePassword('splintersuite', username);
};

const setBalances = (dec, sps) => {
    return store.set('user.balances', { dec, sps });
};

const getBalances = () => {
    return store.get('user.balances');
};

export default {
    setUsername,
    getUsername,
    removeUsername,
    setKey,
    getKey,
    removeKey,
};
