const io = require('socket.io-client');

const socket = io('http://localhost:8080');

socket.connect();

let myself = {};

socket.on('login', (data) => {
  console.log(`login: > ${data.id}`)
  myself = data;
});
