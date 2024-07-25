const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

const PORT = 5000;

io.on('connection', (socket) => {
    console.log('connected to client');

    socket.on('send_message', (data) => {
        console.log(data);
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('disconnected from client');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});