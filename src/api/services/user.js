import keytar from 'keytar';
import store from '../../store';
import axios from '../util/axiosInstance';

const setUsername = (username) => {
    return store.set('username', username);
};

const getUsername = () => {
    return store.get('username');
};

const removeUsername = () => {
    return store.delete('username');
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

const fetchUserData = async ({ username }) => {
    try {
        const userData = await axios.get(
            `${process.env.SERVER_URL}/getUserData`,
            {
                params: { username },
            }
        );
        return userData;
    } catch (err) {
        throw err;
    }
};

export default {
    setUsername,
    getUsername,
    removeUsername,
    setKey,
    getKey,
    removeKey,
    fetchUserData,
};
