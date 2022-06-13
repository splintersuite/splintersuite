import keytar from 'keytar';
import store from '../../store';

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

export default {
    setUsername,
    getUsername,
    removeUsername,
    setKey,
    getKey,
    removeKey,
};
