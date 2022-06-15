import keytar from 'keytar';

import store from '../../store';
import axios from '../util/axios';
import splinterlandsService from './splinterlands';
import hiveService from './hive';

const getUser = async () => {
    const username = getUsername();

    const { dec, sps } = await splinterlandsService.getBalance(username);
    const rc = await hiveService.getRc(username);
    await setBalances({ dec, sps, rc });

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

const setBalances = ({ dec, sps, rc }) => {
    return store.set('user.balances', { dec, sps, rc });
};

const getBalances = () => {
    return store.get('user.balances');
};

const fetchUser = async ({ username }) => {
    const userData = await axios.get(`${process.env.SERVER_URL}/getUserData`, {
        params: { username },
    });
    return userData;
};

export default {
    getUser,
    setUsername,
    getUsername,
    removeUsername,
    setKey,
    getKey,
    removeKey,
    setBalances,
    getBalances,
    fetchUser,
};