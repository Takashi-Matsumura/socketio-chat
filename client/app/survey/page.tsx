"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import BarChart from "../components/mychart";
import QRCodeDisplay from "../components/QRCodeDisplay";

const socket = io(
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
);

interface SurveyResult {
  ans1: number;
  ans2: number;
  ans3: number;
  ans4: number;
  ans5: number;
}

export default function Survey() {
  const [result, setResult] = useState<SurveyResult>({
    ans1: 0,
    ans2: 0,
    ans3: 0,
    ans4: 0,
    ans5: 0,
  });

  useEffect(() => {
    // サーバから集計結果を受信
    socket.on("survey_result", (data: SurveyResult) => {
      setResult(data);
    });

    return () => {
      socket.off("survey_result");
    };
  }, []);

  const handleVote = (answer: "ans1" | "ans2" | "ans3" | "ans4" | "ans5") => {
    // サーバに回答を送信
    socket.emit("submit_vote", { answer });
  };

  const resetSurvey = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-survey`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error resetting survey:", error);
    }
  };

  const currentUrl = window.location.href;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col h-screen items-center">
        <QRCodeDisplay url={currentUrl} />
        <button onClick={resetSurvey}>Reset Survey</button>
        <h1 className="text-2xl my-10">
          アンケート: どちらかの回答を選んでください
        </h1>
        <div className="pt-5 space-x-2">
          <button
            onClick={() => handleVote("ans1")}
            className="bg-blue-500 text-white rounded-full px-4 py-2"
          >
            回答A
          </button>
          <button
            onClick={() => handleVote("ans2")}
            className="bg-pink-500 text-white rounded-full px-4 py-2"
          >
            回答B
          </button>
          <button
            onClick={() => handleVote("ans3")}
            className="bg-yellow-500 text-white rounded-full px-4 py-2"
          >
            回答C
          </button>
        </div>
        <div className="flex flex-col space-y-1 items-center w-full mt-10">
          <h2 className="text-xl">集計結果</h2>
          <div className="bg-gray-200 p-2 rounded-lg w-2/3">
            回答A: {result.ans1}
          </div>
          <div className="bg-gray-200 p-2 rounded-lg w-2/3">
            回答B: {result.ans2}
          </div>
          <div className="bg-gray-200 p-2 rounded-lg w-2/3">
            回答C: {result.ans3}
          </div>
          <div className="w-full mt-10">
            <BarChart data={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
