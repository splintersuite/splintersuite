// 'use strict';
// const path = require('path');
// const fs = require('fs');

// const getRentalDetails = () => {
//     try {
//         const userDataPath = app.getPath('userData');
//         const fileName = 'listingdata.json';
//         const detailsPath = path.join(userDataPath, fileName);

//         const data = parseDataFile({ filePath: detailsPath });
//         console.log(`getRentalDetails data is: ${JSON.stringify(data)}`);
//         return data;
//     } catch (err) {
//         window.api.bot.log({
//             message: `/bot/server/services/rentalDetailsFile/getRentalDetails error: ${err.message}`,
//         });
//         throw err;
//     }
// };

// const updateRentalDetails = ({ data }) => {
//     try {
//         const userDataPath = app.getPath('userData');
//         const fileName = 'listingdata.json';
//         const detailsPath = path.join(userDataPath, fileName);
//         writeDataFile({ filePath: detailsPath, data });
//         return;
//     } catch (err) {
//         window.api.bot.log({
//             message: `/bot/server/services/rentalDetailsFile/updateRentalDetails error: ${err.message}`,
//         });
//         throw err;
//     }
// };

// const parseDataFile = ({ filePath }) => {
//     try {
//         return JSON.parse(fs.readFileSync(filePath));
//     } catch (err) {
//         window.api.bot.log({
//             message: `/bot/server/services/rentalDetailsFile/parseDataFile error: ${err.message}`,
//         });
//         throw err;
//     }
// };

// const writeDataFile = ({ filePath, data }) => {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(data));
//         return;
//     } catch (err) {
//         window.api.bot.log({
//             message: `/bot/server/services/rentalDetailsFile/writeDataFile error: ${err.message}`,
//         });
//         throw err;
//     }
// };

// module.exports = {
//     updateRentalDetails,
//     getRentalDetails,
// };
