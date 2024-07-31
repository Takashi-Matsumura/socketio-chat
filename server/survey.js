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

let surveyResults = {
  ans1: 0,
  ans2: 0,
  ans3: 0,
  ans4: 0,
  ans5: 0,
};

io.on('connection', (socket) => {
  console.log('New client connected');

  // クライアントが接続したときに現在の集計結果を送信
  socket.emit('survey_result', surveyResults);

  // クライアントからの回答を受信
  socket.on('submit_vote', (data) => {
    switch (data.answer) {
      case 'ans1':
        surveyResults.ans1 += 1;
        break;
      case 'ans2':
        surveyResults.ans2 += 1;
        break;
      case 'ans3':
        surveyResults.ans3 += 1;
        break;
      case 'ans4':
        surveyResults.ans4 += 1;
        break;
      case 'ans5':
        surveyResults.ans5 += 1;
        break;
      default:
        break;
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