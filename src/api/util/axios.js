import axios from 'axios';
import encrypt from './crypto';
import axiosRetry from '../../bot/server/axios_retry/axios_retry';

let ss_access_token_iv;
let ss_access_token_content;

if (process.env.SECRET_KEY && process.env.SECRET_MESSAGE) {
    const hash = encrypt(Buffer.from(process.env.SECRET_MESSAGE, 'utf8'));
    ss_access_token_iv = hash.iv;
    ss_access_token_content = hash.content;
}
const axiosInstance = axios.create({
    timeout: 40000,
    headers: {
        ss_access_token_iv,
        ss_access_token_content,
    },
});

axiosRetry.axiosRetry(axiosInstance, {
    retryDelay: (retryCount, error) => {
        console.error(`retryCount: ${retryCount}`);
        if (error?.response?.status === 502) {
            return 5000;
        }
        return 500000;
    },
    retryCondition: (error) => {
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            axiosRetry.gotRateLimited(error)
        );
    },
    shouldResetTimeout: true,
});

export default axiosInstance;
