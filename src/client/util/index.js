// convert 1000 -> 1,000
const separateNumber = (number) => number.toLocaleString('en-US');

const toPercentage = (number) => number * 100;

export default {
    separateNumber,
    toPercentage,
};
