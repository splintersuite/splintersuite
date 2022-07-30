import axios from 'axios';
import encrypt from './crypto';
// TNT TODO: add axios retry to this imo
if (process.env.SECRET_KEY && process.env.SECRET_MESSAGE) {
    const hash = encrypt(Buffer.from(process.env.SECRET_MESSAGE, 'utf8'));
    axios.defaults.headers.common['ss_access_token_iv'] = hash.iv;
    axios.defaults.headers.common['ss_access_token_content'] = hash.content;
}

export default axios;
