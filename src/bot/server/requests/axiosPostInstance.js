'use strict';
const axios = require('axios');

const {
    axiosRetry,
    isNetworkOrIdempotentRequestError,
    gotRateLimited,
    isSplinterlandsServerError,
} = require('../axios_retry/axios_retry');

const axiosPostInstance = axios.create({
    timeout: 40000,
    method: 'post',
});

axiosRetry(axiosPostInstance, {
    retryDelay: (retryCount, error) => {
        console.error(`retryCount: ${retryCount}`);
        console.error('retryDelay called with error: ', error);
        console.error(`error message is: ${error?.message}`);
        console.error(`error response is: ${JSON.stringify(error?.response)}`);
        if (
            error?.response?.status === 504 ||
            error?.response?.status === 502
        ) {
            return 100000;
        } else {
            return 500000;
        }
    },
    retryCondition: (error) => {
        return (
            isNetworkOrIdempotentRequestError ||
            gotRateLimited(error) ||
            isSplinterlandsServerError(error)
        );
    },
    shouldResetTimeout: true,
});

module.exports = { axiosPostInstance };
