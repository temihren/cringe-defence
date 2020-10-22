const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const http = require("http")

const port = process.env.PORT || 3000;

const rootPath = path.join(__dirname, '/');

let messages = [];

const app = express();

const server = http.createServer(app);

app.get('/getLastMessages', (req, res) => {
	res.status(200).json(messages);
});

app.use(express.static(rootPath));

app.get('*', (req, res) => {
	res.sendFile(rootPath + '/index.html');
});

server.listen(port);

const messagesWS = new WebSocket.Server({server});

messagesWS.on('connection', (socket) => {
	socket.on('message', (data) => {
		messages.push(data);
		messagesWS.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	});
	socket.on('error', (er) => {
		console.log(er);
	});
});

messagesWS.on('error', (er) => {
	console.log(er);
});