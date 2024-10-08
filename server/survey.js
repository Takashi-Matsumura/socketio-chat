const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

require('dotenv').config();
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN_URL || "http://localhost:3000"
    }
});

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
    },
    survey3: {
        id: 3,
        question: "あなたの「強み」を教えて！",
        description: "むずかしく考えないで、直感で答えてください",
        options: []
    },
    survey4: {
        id: 4,
        question: "社会人に向けてあなたの不安な項目はどれ？",
        description: "",
        options: ["学び", "時間", "目標", "責任", "評価"]
    },
    survey5: {
        id: 5,
        question: "あなたはどのスキルを伸ばしたいですか?",
        description: "最優先で伸ばしたいスキルを２つ選んでください",
        options: []
    },
    survey6: {
        id: 6,
        question: "コミュニケーションに自信はありますか?",
        description: "",
        options: ["ある", "ない"]
    },
    survey7: {
        id: 7,
        question: "あなたの10年後の未来をおしえて",
        description: "どのような仕事をして、どのような成功をしてみたいか",
        options: []
    },
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