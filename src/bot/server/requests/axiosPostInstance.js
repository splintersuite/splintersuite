'use strict';
const axios = require('axios');

const {
    axiosRetry,
    isNetworkOrIdempotentRequestError,
    gotRateLimited,
} = require('../axios_retry/axios_retry');

const axiosPostInstance = axios.create({
    timeout: 30000,
    method: 'post',
});

axiosRetry(axiosPostInstance, {
    retryDelay: (retryCount, error) => {
        console.error(`retryCount: ${retryCount}`);
        console.error('retryDelay called with error: ', error);
        console.error(`error message is: ${error.message}`);
        return 5000;
    },
    retryCondition: (error) => {
        return isNetworkOrIdempotentRequestError || gotRateLimited(error);
    },
    shouldResetTimeout: true,
});

module.exports = { axiosPostInstance };
