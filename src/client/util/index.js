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
        return Math.round(number * 100);
    }
};

const abbreviateNumber = (num) => {
    if (!num) {
        return 0;
    } else if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(2) + 'k'; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(2) + 'm'; // convert to M for number from > 1 million
    } else if (num < 900) {
        return num.toFixed(0); // if value < 1000, nothing to do
    }
};
export default {
    separateNumber,
    toPercentage,
    abbreviateNumber,
};
