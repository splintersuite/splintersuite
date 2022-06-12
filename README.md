# Setup

```
npm install
npm start
```

# File Structure

```
/src
	/main.js			- main thread
	/renderer.js 		- renderer thread
	/client 			- React app
	/api				- API
```

# IPC Events

```
user:login
user:logout
user:get

bot:start
bot:stop
bot:getSettings
bot:updateSettings
```
