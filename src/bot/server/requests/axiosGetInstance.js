'use strict';
const axios = require('axios');

const {
    axiosRetry,
    isNetworkOrIdempotentRequestError,
    gotRateLimited,
} = require('../axios_retry/axios_retry');

const axiosInstance = axios.create({
    timeout: 60000,
});

axiosRetry(axiosInstance, {
    retryDelay: (retryCount, error) => {
        console.error(`retryCount: ${retryCount}`);
        console.error('retryDelay called with error: ', error);
        console.error(`error message is: ${error.message}`);
        if (error.response.status === 502) {
            return 5000;
        }
        return 500000;
    },
    retryCondition: (error) => {
        return isNetworkOrIdempotentRequestError || gotRateLimited(error);
    },
    shouldResetTimeout: true,
});

module.exports = { axiosInstance };
