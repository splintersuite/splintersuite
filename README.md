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

### `user-login` 

Request Body (POST):
```
{
	username: 'Tameshon',
	activeKey: '1231312asdkajsd12kj312k3jk1l2j31klj3'
}
```
### `user-wallet-data`
Request Body:
```
{
	username: 'Tameshon',
	activeKey: '1231312asdkajsd12kj312k3jk1l2j31klj3'
}
```
### `user-bot-performance`

### `user-bot-settings`
Request Body:
```
{
	username: 'Tameshon',
	activeKey: '1231312asdkajsd12kj312k3jk1l2j31klj3'
}
```
### `user-bot-start`
Request Body:
```
{
	username: 'Tameshon',
	activeKey: '1231312asdkajsd12kj312k3jk1l2j31klj3'
}
```
### `user-bot-stop`

### `user-delist-cards`