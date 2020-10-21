const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const rootPath = path.join(__dirname, '/');

const app = express();

const messagesWS = new WebSocket.Server({
	path: '/messages',
	port: 8080,
	perMessageDeflate: {
		threshold: 1024,
	}
});

let messages = [];

const pushNewMessage = (message) => new Promise(resolve => {
	const newMessages = messages.slice();
	if (newMessages.length > 5) {
		newMessages.shift();
	}
	newMessages.push(message);

	resolve(newMessages);
});

messagesWS.on('connection', (socket) => {
	socket.on('message', (data) => {
		pushNewMessage(data).then(newMessages => {
			socket.send(JSON.stringify(newMessages));
			messages = newMessages;
		});
	});
});



app.get('/getLastMessages', (req, res) => {
	res.status(200).json(messages);
});

app.use(express.static(rootPath));

app.get('*', (req, res) => {
	res.sendFile(rootPath + 'index.html');
});

app.listen(process.env.PORT || 3000, () => console.log('DA'));