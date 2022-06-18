const config = {
    packagerConfig: {
        icon: './src/client/assets/icons/icon',
        name: 'SplinterSuite',
        executableName: 'splintersuite',
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                description: 'Rent your Splinterlands cards with ease.',
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                icon: {
                    scalable: './src/client/assets/icons/icon.svg',
                },
                description: 'Rent your Splinterlands cards with ease.',
            },
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {
                icon: {
                    scalable: './src/client/assets/icons/icon.svg',
                },
                description: 'Rent your Splinterlands cards with ease.',
            },
        },
    ],
    plugins: [
        [
            '@electron-forge/plugin-webpack',
            {
                mainConfig: './webpack.main.config.js',
                devContentSecurityPolicy:
                    "connect-src 'self' https://api2.splinterlands.com 'unsafe-eval'",
                renderer: {
                    config: './webpack.renderer.config.js',
                    entryPoints: [
                        {
                            html: './src/client/index.html',
                            js: './src/client/renderer.js',
                            name: 'main_window',
                            // preload: { js: './src/client/preload.js' },
                        },
                        {
                            html: './src/bot/index.html',
                            js: './src/bot/renderer.js',
                            name: 'bot_window',
                            // preload: { js: './src/bot/preload.js' },
                        },
                    ],
                },
            },
        ],
    ],
};

module.exports = config;
