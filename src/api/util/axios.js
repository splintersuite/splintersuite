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
    transitional: {
        clarifyTimeoutError: true,
    },
});

axiosRetry.axiosRetry(axiosInstance, {
    retryDelay: (retryCount, error) => {
        console.error(`retryCount: ${retryCount}`);
        console.error('retryDelay called with error: ', error);
        console.error(`error message is: ${error.message}`);
        console.error(`error response is: ${JSON.stringify(error?.response)}`);
        if (error?.response?.status === 502) {
            return 5000;
        } else if (error?.response?.status === 504) {
            console.error(
                `this is a 504 response, splinterlands might be having issues`
            );
            return 100000;
        } else if (error?.response?.status === 503) {
            console.error(
                `this is a 503 response, splinterlands might be having issues`
            );
            return 100000;
        } else {
            return 500000;
        }
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
