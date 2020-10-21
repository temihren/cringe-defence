const express = require('express');
const path = require('path');

const rootPath = path.join(__dirname, '/');

const app = express();

app.get('*', (req, res) => {
	res.sendFile(rootPath + 'index.html');
});

app.listen(process.env.PORT || 3000);