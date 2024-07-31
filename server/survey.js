const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors()); // CORSを有効にする
app.use(express.json());

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

const surveys = {
  survey1: {
    question: "What is your favorite color?",
    options: ["Red", "Blue", "Green", "Yellow", "Other"]
  },
  survey2: {
    question: "What is your favorite food?",
    options: ["Pizza", "Burger", "Sushi", "Pasta", "Other"]
  }
};

let currentSurvey = surveys.survey1;

let surveyResults = {
  ans1: 0,
  ans2: 0,
  ans3: 0,
  ans4: 0,
  ans5: 0,
};

app.post('/select-survey', (req, res) => {
  const { surveyId } = req.body;
  if (surveys[surveyId]) {
    currentSurvey = surveys[surveyId];
    io.emit('survey-update', currentSurvey); // クライアントにアンケートの更新を通知
    res.send({ message: 'Survey selected successfully.' });
  } else {
    res.status(400).send({ message: 'Invalid survey ID.' });
  }
});

app.get('/current-survey', (req, res) => {
  res.send(currentSurvey);
});

// リセットエンドポイント
app.post('/reset-survey', (req, res) => {
  surveyResults = {
    ans1: 0,
    ans2: 0,
    ans3: 0,
    ans4: 0,
    ans5: 0,
  };
  io.emit('survey_result', surveyResults); // クライアントにリセットされた結果を送信
  res.send({ message: 'Survey results have been reset.' });
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('survey_selected', currentSurvey);
  socket.emit('survey_result', surveyResults);
  socket.emit('survey-update', currentSurvey);

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
    }
    io.emit('survey_result', surveyResults);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));