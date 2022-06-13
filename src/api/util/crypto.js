const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-ctr',
        process.env.SECRET_KEY,
        iv
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
    };
};

export default encrypt;
