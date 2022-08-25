const { axiosInstance } = require('../requests/axiosGetInstance');

const getCurrentSeason = async () => {
    try {
        //  console.log(`/bot/server/actions/currentSeason/getCurrentSeason`);

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
        window.api.bot.log({
            message: `/bot/server/actions/currentSeason/getCurrentSeason error: ${err.message}`,
        });
        throw err;
    }
};

const cancellationMatrix = [
    { daysTillEOS: 15, cancellationThreshold: 5.0 },
    { daysTillEOS: 14, cancellationThreshold: 1.0 },
    { daysTillEOS: 13, cancellationThreshold: 0.5 },
    { daysTillEOS: 12, cancellationThreshold: 0.2 },
    { daysTillEOS: 11, cancellationThreshold: 0.15 },
    { daysTillEOS: 10, cancellationThreshold: 0.1 },
    { daysTillEOS: 9, cancellationThreshold: 0.07 },
    { daysTillEOS: 8, cancellationThreshold: 0.07 },
    { daysTillEOS: 7, cancellationThreshold: 0.07 },
    { daysTillEOS: 6, cancellationThreshold: 0.07 },
    { daysTillEOS: 5, cancellationThreshold: 0.05 },
    { daysTillEOS: 4, cancellationThreshold: 0.05 },
    { daysTillEOS: 3, cancellationThreshold: 0.02 },
    { daysTillEOS: 2, cancellationThreshold: 0.02 },
    { daysTillEOS: 1, cancellationThreshold: 99999 },
];

const getEndOfSeasonSettings = ({ season }) => {
    try {
        // console.log(`/bot/server/actions/currentSeason/getEndOfSeasonSettings`);

        const seasonEndTime = new Date(season.ends).getTime();
        const msInDay = 1000 * 60 * 60 * 24;
        const msInTwelveHours = 1000 * 60 * 60 * 12;
        const nowTime = new Date().getTime();
        const msTillSeasonEnd = seasonEndTime - nowTime;
        let endOfSeasonSettings = {
            ...cancellationMatrix[0],
            msTillSeasonEnd: msInDay * 16,
        };
        cancellationMatrix.some((day) => {
            if (day.daysTillEOS === 1) {
                day.timeStart =
                    seasonEndTime -
                    (day.daysTillEOS * msInDay + msInTwelveHours);
                day.timeEnd = seasonEndTime - (day.daysTillEOS - 1) * msInDay;
            } else if (day.daysTillEOS === 2) {
                day.timeStart = seasonEndTime - day.daysTillEOS * msInDay;
                day.timeEnd =
                    seasonEndTime -
                    ((day.daysTillEOS - 1) * msInDay + msInTwelveHours);
            } else {
                day.timeStart = seasonEndTime - day.daysTillEOS * msInDay;
                day.timeEnd = seasonEndTime - (day.daysTillEOS - 1) * msInDay;
            }
            if (day.timeEnd >= nowTime && nowTime > day.timeStart) {
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
                return true;
            }
        });

        return endOfSeasonSettings;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/currentSeason/getEndOfSeasonSettings error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getCurrentSeason,
    getEndOfSeasonSettings,
};

/*
Access to XMLHttpRequest at 'https://api2.splinterlands.com/settings' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
xhr.js?1f12:221          GET https://api2.splinterlands.com/settings net::ERR_FAILED 504
dispatchXhrRequest @ xhr.js?1f12:221
xhrAdapter @ xhr.js?1f12:26
dispatchRequest @ dispatchRequest.js?c6af:46
Promise.then (async)
request @ Axios.js?8cee:92
wrap @ bind.js?a2f9:11
getCurrentSeason @ currentSeason.js?28e3:7
startRentalBot @ index.js?049c:40
eval @ index.js?2681:51
await in eval (async)
emit @ VM8 sandbox_bundle:112
onMessage @ VM8 sandbox_bundle:37
bot_window:1 Uncaught (in promise) 
*/
