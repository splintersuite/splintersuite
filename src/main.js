const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const user = require('./api/controllers/user').default;
const bot = require('./api/controllers/bot').default;
const hive = require('./api/controllers/hive').default;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: __dirname + '/client/assets/icons/icon.png',
        webPreferences: {
            sandbox: true,
            contextIsolation: true,
            preload: path.join(__dirname, './client/preload.js'),
        },
    });
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.webContents.openDevTools();

    const botWindow = new BrowserWindow({
        // show: false,
        width: 1200,
        height: 800,
        webPreferences: {
            sandbox: true,
            contextIsolation: true,
            preload: path.join(__dirname, './bot/preload.js'),
        },
    });
    botWindow.loadURL(BOT_WINDOW_WEBPACK_ENTRY);
    botWindow.webContents.openDevTools();

    ipcMain.handle('user:login', user.login);
    ipcMain.handle('user:logout', user.logout);
    ipcMain.handle('user:get', user.get);

    ipcMain.handle('bot:start', (event) => {
        bot.start();
        botWindow.webContents.send('bot:start');
    });
    ipcMain.handle('bot:stop', (event) => {
        bot.stop();
        botWindow.webContents.send('bot:stop');
    });
    ipcMain.handle('bot:getActive', bot.getActive);
    ipcMain.handle('bot:getSettings', bot.getSettings);
    ipcMain.handle('bot:updateSettings', bot.updateSettings);
    ipcMain.handle('bot:getStats', bot.getStats);
    ipcMain.handle('bot:updateStats', bot.updateStats);
    ipcMain.handle('bot:getLoading', bot.getLoading);
    ipcMain.handle('bot:updateLoading', (event, payload) => {
        bot.updateLoading(event, payload);
        mainWindow.webContents.send('bot:updateLoading', payload);
    });

    ipcMain.handle('hive:createRentals', hive.createRentals);
    ipcMain.handle('hive:updateRentals', hive.updateRentals);
    ipcMain.handle('hive:deleteRentals', hive.deleteRentals);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
