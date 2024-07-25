const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

let surveyResults = {
  male: 0,
  female: 0,
};

io.on('connection', (socket) => {
  console.log('New client connected');

  // クライアントが接続したときに現在の集計結果を送信
  socket.emit('survey_result', surveyResults);

  // クライアントからの回答を受信
  socket.on('submit_vote', (data) => {
    if (data.gender === 'male') {
      surveyResults.male += 1;
    } else if (data.gender === 'female') {
      surveyResults.female += 1;
    }

    // 更新された集計結果を全クライアントに送信
    io.emit('survey_result', surveyResults);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));