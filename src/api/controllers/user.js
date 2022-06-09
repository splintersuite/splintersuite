import crypto from 'crypto-js';

const login = (event, payload) => {
    const { account, key } = payload;

    // Encrypt
    const ciphertext = crypto.AES.encrypt(key, 'secret key 123').toString();

    // Decrypt
    const bytes = crypto.AES.decrypt(ciphertext, 'secret key 123');
    const originalText = bytes.toString(crypto.enc.Utf8);

    console.log('USER CONTROLLER RECEIVED: ', originalText);
};

export default { login };
