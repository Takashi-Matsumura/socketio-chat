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

const { v4: uuidv4 } = require('uuid');

const PORT = 5000;
const surveys = {
    survey0: {
        id: 0,
        question: "出席を確認します!",
        description: "[出席]ボタンをタップしてください。",
        options: ["出席"]
    },
    survey1: {
        id: 1,
        question: "あなたの知っている有名なIT企業は?",
        description: "複数回答可（一社ずつ回答）",
        options: []
    },
    survey2: {
        id: 2,
        question: "どのエンジニアに興味がありますか?",
        description: "",
        options: ["ソフト", "システム", "ネットワーク", "クラウド", "その他"]
    }
};
let surveyResults = [0, 0, 0, 0, 0];
const resetSurveyResults = () => {
    surveyResults = [0, 0, 0, 0, 0];
};

io.on('connection', (socket) => {
    console.log('connected to client');

    socket.on('disconnect', () => {
        console.log('disconnected from client');
    });

    socket.on('select_survey', (survey) => {
        resetSurveyResults();
        io.emit('survey_changed', surveys[survey]);
    });

    socket.on('send_message', (data) => {
        console.log(data);
        data.id = uuidv4();
        io.emit('receive_message', data);
    });

    socket.on('send_vote', (index) => {
        if (index >= 0 && index < surveyResults.length) {
            surveyResults[index]++;
            console.log(surveyResults);
        } else {
            console.error('Invalid index');
        }
        io.emit('receive_votes', surveyResults);
    });

    
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});