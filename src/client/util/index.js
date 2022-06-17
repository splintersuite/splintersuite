// convert 1000 -> 1,000
const separateNumber = (number) => {
    if (!number) {
        return 0;
    } else {
        return number.toLocaleString('en-US');
    }
};

const toPercentage = (number) => {
    if (!number) {
        return 0;
    } else {
        return number * 100;
    }
};

export default {
    separateNumber,
    toPercentage,
};
