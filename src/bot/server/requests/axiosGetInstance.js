'use strict';
const axios = require('axios');

const {
    axiosRetry,
    isNetworkOrIdempotentRequestError,
    gotRateLimited,
    isSplinterlandsServerError,
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
        console.error(`error message is: ${error?.message}`);
        console.error(`error response is: ${JSON.stringify(error?.response)}`);
        if (
            error?.response?.status === 504 ||
            error?.response?.status === 502 ||
            error?.response?.status === 503
        ) {
            console.error(`response status is: ${error?.response?.status}`);
            return 100000;
        } else {
            return 500000;
        }
    },
    retryCondition: (error) => {
        console.error(`retryCondition, error is: ${JSON.stringify(error)}`);
        console.error(`error.response: ${JSON.stringify(error?.response)}`);
        console.error(`error.response.status is: ${error?.response?.status}`);
        console.error(`error message is: ${error?.message}`);
        return (
            isNetworkOrIdempotentRequestError(error) ||
            gotRateLimited(error) ||
            isSplinterlandsServerError(error)
        );
    },
    shouldResetTimeout: true,
});

module.exports = { axiosInstance };
