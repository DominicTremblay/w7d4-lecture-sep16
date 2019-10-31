const express = require('express');
const SocketServer = require('ws');
const PORT = process.env.port || 3000;
const app = express();
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
const wss = new SocketServer.Server({ server });

wss.on('connection', ws => {
  ws.on('message', data => {});

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
