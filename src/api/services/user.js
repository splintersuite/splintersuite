import keytar from 'keytar';

import store from '../../store';
import axios from '../util/axios';
import splinterlandsService from './splinterlands';
import hiveService from './hive';
import invoiceService from './invoice';

const getUser = async () => {
    const username = await getUsername();

    const { dec, sps } = await splinterlandsService.getBalance(username);
    const rc = await hiveService.getRc(username);
    await setBalances({ dec, sps, rc });

    const user = await fetchUser(username);
    await setId(user.id);
    await setStats(user.stats);
    await setLocked(user.locked);

    const invoices = await invoiceService.get(username);
    await setInvoices(invoices);

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

const setInvoices = (invoices) => {
    return store.set('user.invoices', invoices);
};

const getInvoices = () => {
    return store.get('user.invoices');
};

const setId = (id) => {
    return store.set('user.id', id);
};

const getId = () => {
    return store.get('user.id');
};

const setLocked = (locked) => {
    return store.set('user.locked', locked);
};

const getLocked = () => {
    return store.get('user.locked');
};

const setStats = (stats) => {
    return store.set('user.stats', stats);
};

const getStats = () => {
    return store.get('user.stats');
};

const fetchUser = async (username) => {
    const { data } = await axios.get(
        `${process.env.API_URL}/api/users/${username}`
    );
    return data;
};

const updateRentals = async (username, rentals) => {
    const res = await axios.post(
        `${process.env.API_URL}/api/rentals/${username}`,
        { rentals }
    );
    return res;
};

const clear = async () => {
    await store.clear();
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
    setInvoices,
    getInvoices,
    setLocked,
    getLocked,
    fetchUser,
    updateRentals,
    getId,
    clear,
};
