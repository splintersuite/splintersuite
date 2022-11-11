import fs from 'fs';
import path from 'path';
import { app } from 'electron';
const getRentalDetails = () => {
    const userDataPath = app.getPath('userData');
    const fileName = 'listingdata.json';
    const detailsPath = path.join(userDataPath, fileName);

    const data = parseDataFile({ filePath: detailsPath });
    return data;
};

const updateRentalDetails = ({ data }) => {
    const userDataPath = app.getPath('userData');
    const fileName = 'listingdata.json';
    const detailsPath = path.join(userDataPath, fileName);
    writeDataFile({ filePath: detailsPath, data });
    return;
};

const parseDataFile = ({ filePath }) => {
    try {
        // https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
        return JSON.parse(JSON.parse(fs.readFileSync(filePath)));
    } catch (err) {
        return {};
    }
};

const writeDataFile = ({ filePath, data }) => {
    fs.writeFileSync(filePath, JSON.stringify(data));
    return;
};

export default {
    updateRentalDetails,
    getRentalDetails,
};
