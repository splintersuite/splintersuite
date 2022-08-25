'use strict';
const axios = require('axios');

const {
    axiosRetry,
    isNetworkOrIdempotentRequestError,
    gotRateLimited,
} = require('../axios_retry/axios_retry');

const axiosInstance = axios.create({
    timeout: 40000,
    transitional: {
        clarifyTimeoutError: true,
    },
});

axiosRetry(axiosInstance, {
    retryDelay: (retryCount, error) => {
        console.error(`retryCount: ${retryCount}`);
        console.error('retryDelay called with error: ', error);
        console.error(`error message is: ${error.message}`);
        console.error(`error response is: ${JSON.stringify(err?.response)}`);
        if (error?.response?.status === 502) {
            return 5000;
        } else if (error?.response?.status === 504) {
            return 100000;
        } else {
            return 500000;
        }
    },
    retryCondition: (error) => {
        return (
            isNetworkOrIdempotentRequestError(error) || gotRateLimited(error)
        );
    },
    shouldResetTimeout: true,
});

module.exports = { axiosInstance };
