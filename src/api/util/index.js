// EXAMPLE
const formatFud = (fud) => {
    // formats fud and returns formatted fud
};

const success = () => {
    return {
        code: 1,
        message: 'success',
        error: null,
    };
};

const error = (error) => {
    return {
        code: 0,
        message: 'error',
        error,
    };
};

export default {
    success,
    error,
};
