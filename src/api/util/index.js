// EXAMPLE
const formatFud = (fud) => {
    // formats fud and returns formatted fud
};

const success = (data) => {
    return {
        code: 1,
        data,
        message: 'success',
    };
};

const error = (error) => {
    return {
        code: 0,
        error,
        message: 'error',
    };
};

export default {
    success,
    error,
};
