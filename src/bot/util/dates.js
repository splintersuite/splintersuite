'use strict';

const getNumDaysAgo = ({ numberOfDaysAgo, date }) => {
    try {
        // console.log(
        //     `/bot/server/util/dates/getNumDaysAgo start with numberOfDaysAgo: ${numberOfDaysAgo}, date: ${date}`
        // );
        const nowMs = date?.getTime();
        if (!nowMs) {
            window.api.bot.log({
                message: `/bot/server/util/dates/getNumDaysAgo nowMS failed from date: ${date}, numberOfDaysAgo: ${numberOfDaysAgo}`,
            });
            return null;
        }
        const msInADay = 1000 * 60 * 60 * 24;
        const numOfDaysAgoMs = msInADay * numberOfDaysAgo;
        const msDaysAgo = nowMs - parseInt(numOfDaysAgoMs);
        const daysAgo = new Date(msDaysAgo);

        return { daysAgo, msDaysAgo: parseInt(msDaysAgo) };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/util/dates/getNumDaysAgo error: ${err.message}`,
        });
        throw err;
    }
};

const getNumDaysFromNow = ({ numberOfDaysFromNow }) => {
    try {
        const nowMs = new Date.getTime();
        const msInADay = 1000 * 60 * 60 * 24;
        const numOfDaysMs = msInADay * numberOfDaysFromNow;
        const msDaysFromNow = nowMS + parseInt(numOfDaysMs);
        const daysFromNow = new Date(msDaysFromNow);

        return { daysFromNow, msDaysFromNow: parseInt(msDaysFromNow) };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/util/dates/getNumDaysFromNow error: ${err.message}`,
        });
        throw err;
    }
};

const isBeforeTime = ({ time, dateTime }) => {
    try {
        // const nowTime = date.getTime();
        const compareTime = time;

        const difference = dateTime - compareTime;
        if (difference && difference > 0) {
            // the time passed in, is occuring before the input date
            return true;
        } else {
            return false;
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/util/dates/isBeforeTime error: ${err.message}`,
        });
        throw err;
    }
};

const isAfterTime = ({ time, dateTime }) => {
    try {
        // const nowTime = date.getTime();
        const compareTime = time;

        const difference = dateTime - compareTime;
        if (difference && difference < 0) {
            // difference is negative, therefore the time is after the given date
            return true;
        } else {
            return false;
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/util/dates/isAfterTime error: ${err.message}`,
        });
        throw err;
    }
};

const roundedDownDaysAgo = ({ pastTime }) => {
    try {
        const nowTime = new Date().getTime();
        const msInADay = 1000 * 60 * 60 * 24;
        console.log('nowTime', nowTime);
        console.log('pastTime', pastTime);
        const difference = nowTime - pastTime;
        const dividedFloat = difference / msInADay;
        const roundedDownDaysAgo = Math.floor(dividedFloat);

        return roundedDownDaysAgo;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/util/dates/roundedDownDaysAgo error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getNumDaysAgo,
    getNumDaysFromNow,
    isAfterTime,
    roundedDownDaysAgo,
    isBeforeTime,
};
