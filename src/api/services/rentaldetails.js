import fs from 'fs';
import path from 'path';
import { app } from 'electron';
const getRentalDetails = () => {
    // try {
    const userDataPath = app.getPath('userData');
    const fileName = 'listingdata.json';
    const detailsPath = path.join(userDataPath, fileName);

    const data = parseDataFile({ filePath: detailsPath });
    console.log(`getRentalDetails data is: ${JSON.stringify(data)}`);
    return data;
    // } catch (err) {
    //     window.api.bot.log({
    //         message: `/bot/server/services/rentalDetailsFile/getRentalDetails error: ${err.message}`,
    //     });
    //     throw err;
    // }
};

const updateRentalDetails = ({ data }) => {
    // try {
    console.log('/services/updateRentalDetails start');
    const userDataPath = app.getPath('userData');
    const fileName = 'listingdata.json';
    const detailsPath = path.join(userDataPath, fileName);
    //const stringData = JSON.stringify(data);
    writeDataFile({ filePath: detailsPath, data });
    return;
    // } catch (err) {
    //     window.api.bot.log({
    //         message: `/bot/server/services/rentalDetailsFile/updateRentalDetails error: ${err.message}`,
    //     });
    //     throw err;
    // }
};

const parseDataFile = ({ filePath }) => {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        return {};
    }
};

const writeDataFile = ({ filePath, data }) => {
    //  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
    return;
    // } catch (err) {
    //     window.api.bot.log({
    //         message: `/bot/server/services/rentalDetailsFile/writeDataFile error: ${err.message}`,
    //     });
    //     throw err;
    // }
};

export default {
    updateRentalDetails,
    getRentalDetails,
};
