const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const log = require('electron-log');

const user = require('./api/controllers/user').default;
const market = require('./api/controllers/market').default;
const bot = require('./api/controllers/bot').default;
const hive = require('./api/controllers/hive').default;
const invoice = require('./api/controllers/invoice').default;
const middlewareWrapper = require('./api/middleware').default;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

app.on('ready', () => {
    // ---
    // Windows
    // ------------------------------------
    const mainWindow = new BrowserWindow({
        width: 1150,
        height: 1024,
        icon: path.join(__dirname, './client/assets/icons/icon.png'),
        webPreferences: {
            sandbox: true,
            contextIsolation: true,
            preload: path.join(__dirname, '/client/preload.js'),
        },
    });
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    const botWindow = new BrowserWindow({
        show: true,
        width: 1200,
        height: 800,
        webPreferences: {
            sandbox: true,
            contextIsolation: true,
            preload: path.join(__dirname, '/bot/preload.js'),
        },
    });
    botWindow.loadURL(BOT_WINDOW_WEBPACK_ENTRY);

    if (isDev) {
        mainWindow.webContents.openDevTools();
        botWindow.webContents.openDevTools();
    }

    // ---
    // Routes
    // ------------------------------------
    ipcMain.handle('user:login', middlewareWrapper(user.login, 'user:login'));
    ipcMain.handle(
        'user:logout',
        middlewareWrapper(user.logout, 'user:logout')
    );
    ipcMain.handle('user:get', middlewareWrapper(user.get, 'user:get'));

    ipcMain.handle('bot:start', (event) => {
        middlewareWrapper(bot.start, 'bot:start')(event);
        botWindow.webContents.send('bot:start');
    });
    ipcMain.handle('bot:stop', (event) => {
        middlewareWrapper(bot.stop, 'bot:stop')(event);
        botWindow.webContents.send('bot:stop');
    });
    ipcMain.handle(
        'bot:getActive',
        middlewareWrapper(bot.getActive, 'bot:getActive')
    );
    ipcMain.handle(
        'bot:getSettings',
        middlewareWrapper(bot.getSettings, 'bot:getSettings')
    );
    ipcMain.handle(
        'bot:updateSettings',
        middlewareWrapper(bot.updateSettings, 'bot:updateSettings')
    );
    ipcMain.handle(
        'bot:getStats',
        middlewareWrapper(bot.getStats, 'bot:getStats')
    );
    ipcMain.handle('bot:updateStats', (event, payload) => {
        middlewareWrapper(bot.updateStats, 'bot:updateStats')(event, payload);
        mainWindow.webContents.send('bot:reloadStats', payload);
    });
    ipcMain.handle(
        'bot:getLoading',
        middlewareWrapper(bot.getLoading, 'bot:getLoading')
    );
    ipcMain.handle('bot:updateLoading', (event, payload) => {
        bot.updateLoading(event, payload);
        mainWindow.webContents.send('bot:updateLoading', payload);
    });
    ipcMain.handle(
        'bot:getRentalDetails',
        middlewareWrapper(bot.getRentalDetails, 'bot:getRentalDetails')
    );
    ipcMain.handle('bot:updateRentalDetails', (event, payload) => {
        bot.updateRentalDetails(event, payload);
        mainWindow.webContents.send('bot:updateRentalDetails', payload);
    });
    ipcMain.handle('bot:log', bot.log);
    ipcMain.handle(
        'market:getMarketPrices',
        middlewareWrapper(market.getMarketPrices, 'market:getMarketPrices')
    );
    ipcMain.handle(
        'hive:createRentals',
        middlewareWrapper(hive.createRentals, 'hive:createRentals')
    );
    ipcMain.handle(
        'hive:updateRentals',
        middlewareWrapper(hive.updateRentals, 'hive:updateRentals')
    );
    ipcMain.handle(
        'hive:relistActiveRentals',
        middlewareWrapper(hive.relistActiveRentals, 'hive:relistActiveRentals')
    );
    ipcMain.handle(
        'hive:deleteRentals',
        middlewareWrapper(hive.deleteRentals, 'hive:deleteRentals')
    );

    ipcMain.handle(
        'invoice:get',
        middlewareWrapper(invoice.get, 'invoice:get')
    );
    ipcMain.handle(
        'invoice:update',
        middlewareWrapper(invoice.update, 'invoice:update')
    );
    ipcMain.handle(
        'invoice:confirm',
        middlewareWrapper(invoice.confirm, 'invoice:confirm')
    );

    // ---
    // Auto-Update
    // ------------------------------------
    if (!isDev) {
        const server = 'https://splintersuite-updater-zjqp.vercel.app';
        const url = `${server}/update/${process.platform}/${app.getVersion()}`;

        autoUpdater.setFeedURL({ url });
        autoUpdater.checkForUpdates();

        autoUpdater.on(
            'update-downloaded',
            (event, releaseNotes, releaseName) => {
                log.info('Update Received');
                // const dialogOpts = {
                //     type: 'info',
                //     buttons: ['Restart', 'Later'],
                //     title: 'Application Update',
                //     message:
                //         process.platform === 'win32'
                //             ? releaseNotes
                //             : releaseName,
                //     detail: 'A new version has been downloaded. Restart the application to apply the updates.',
                // };

                // dialog.showMessageBox(dialogOpts).then((returnValue) => {
                //     if (returnValue.response === 0)
                // });
                autoUpdater.quitAndInstall();
            }
        );
    }
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
