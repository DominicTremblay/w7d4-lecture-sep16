const express = require('express');
const PORT = process.env.port || 3001;
const uuid = require('uuid/v4');
const SocketServer = require('ws');

const app = express();
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const wss = new SocketServer.Server({ server });

wss.broadcast = data => {
  wss.clients.forEach(client => {
    if (client.readyState === SocketServer.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', wsClient => {
  console.log('Client connected');

  wsClient.on('message', data => {
    const message = JSON.parse(data);

    message.id = uuid().substr(0, 7);

    switch (message.type) {
    case 'postMessage':
      message.type = 'incomingMessage';
      break;
    case 'postNotification':
      message.type = 'incomingNotification';
      break;
    default:
      console.log('Unkown type of message');
    }

    // broadcast the message to all clients
    wss.broadcast(JSON.stringify(message));
  });

  wsClient.on('close', () => console.log('Client disconnected'));
});
