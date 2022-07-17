const { axiosInstance } = require('../requests/axiosGetInstance');

const getCurrentSeason = async () => {
    try {
        console.log(`/bot/server/actions/currentSeason/getCurrentSeason`);

        let res = await axiosInstance(
            'https://api2.splinterlands.com/settings'
        );
        if (res?.data?.season?.ends) {
            const { season } = res.data;
            const { id, name, ends } = season;
            return { id, name, ends };
        }
        return null;
    } catch (err) {
        console.log(
            `/bot/server/actions/currentSeason/getCurrentSeason: ${err.message}`
        );
        throw err;
    }
};

const cancellationMatrix = [
    { daysTillEOS: 15, cancellationThreshold: 5.0 },
    { daysTillEOS: 14, cancellationThreshold: 3.0 },
    { daysTillEOS: 13, cancellationThreshold: 1.0 },
    { daysTillEOS: 12, cancellationThreshold: 0.9 },
    { daysTillEOS: 11, cancellationThreshold: 0.8 },
    { daysTillEOS: 10, cancellationThreshold: 0.7 },
    { daysTillEOS: 9, cancellationThreshold: 0.6 },
    { daysTillEOS: 8, cancellationThreshold: 0.5 },
    { daysTillEOS: 7, cancellationThreshold: 0.4 },
    { daysTillEOS: 6, cancellationThreshold: 0.3 },
    { daysTillEOS: 5, cancellationThreshold: 0.2 },
    { daysTillEOS: 4, cancellationThreshold: 0.01 },
    { daysTillEOS: 3, cancellationThreshold: 0.01 },
    { daysTillEOS: 2, cancellationThreshold: 0.001 },
    { daysTillEOS: 1, cancellationThreshold: 0.001 },
];

const getEndOfSeasonSettings = ({ season }) => {
    console.log(`/bot/server/actions/currentSeason/getEndOfSeasonSettings`);

    const seasonEndTime = new Date(season.ends).getTime();
    const msInDay = 1000 * 60 * 60 * 24;
    const msInFourHours = 1000 * 60 * 60 * 4;
    const nowTime = new Date().getTime();
    const msTillSeasonEnd = seasonEndTime - nowTime;
    let endOfSeasonSettings = {
        ...cancellationMatrix[0],
        msTillSeasonEnd: msInDay * 16,
    };
    cancellationMatrix.some((day) => {
        if (day.daysTillEOS === 1) {
            day.timeStart =
                seasonEndTime - (day.daysTillEOS * msInDay + msInFourHours);
            day.timeEnd = seasonEndTime - (day.daysTillEOS - 1) * msInDay;
        } else if (day.daysTillEOS === 2) {
            day.timeStart = seasonEndTime - day.daysTillEOS * msInDay;
            day.timeEnd =
                seasonEndTime -
                ((day.daysTillEOS - 1) * msInDay + msInFourHours);
        } else {
            day.timeStart = seasonEndTime - day.daysTillEOS * msInDay;
            day.timeEnd = seasonEndTime - (day.daysTillEOS - 1) * msInDay;
        }
        if (day.timeEnd > nowTime && nowTime > day.timeStart) {
            if (day.daysTillEOS === 1) {
                // make it such that this is almost impossible
                // so you NEVER cancel in the last 28 hours of the season
                // (listingPrice - buy_price) / listingPrice >
                //     endOfSeasonSettings.cancellationThreshold;
                endOfSeasonSettings = {
                    msTillSeasonEnd,
                    ...day,
                    cancellationThreshold: 99999,
                };
            } else {
                endOfSeasonSettings = {
                    msTillSeasonEnd,
                    ...day,
                };
            }
            // return true;
        }
    });
    process.exit();
    return endOfSeasonSettings;
};

module.exports = {
    getCurrentSeason,
    getEndOfSeasonSettings,
};
