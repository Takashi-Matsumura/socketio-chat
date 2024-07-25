"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

// const socket = io(
//   process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
// );
const socket = io("http://localhost:5000");

interface SurveyResult {
  male: number;
  female: number;
}

export default function Survey() {
  const [result, setResult] = useState<SurveyResult>({ male: 0, female: 0 });

  useEffect(() => {
    // サーバから集計結果を受信
    socket.on("survey_result", (data: SurveyResult) => {
      setResult(data);
    });

    return () => {
      socket.off("survey_result");
    };
  }, []);

  const handleVote = (gender: "male" | "female") => {
    // サーバに回答を送信
    socket.emit("submit_vote", { gender });
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col h-screen items-center">
        <h1 className="text-2xl my-10">アンケート: あなたの性別は？</h1>
        <div className="pt-5 space-x-2">
          <button
            onClick={() => handleVote("male")}
            className="bg-blue-500 text-white rounded-full px-4 py-2"
          >
            男性
          </button>
          <button
            onClick={() => handleVote("female")}
            className="bg-pink-500 text-white rounded-full px-4 py-2"
          >
            女性
          </button>
        </div>
        <div className="flex flex-col space-y-1 items-center w-full mt-10">
          <h2 className="text-xl">集計結果</h2>
          <div className="bg-gray-200 p-2 rounded-lg w-2/3">
            男性: {result.male}
          </div>
          <div className="bg-gray-200 p-2 rounded-lg w-2/3">
            女性: {result.female}
          </div>
        </div>
      </div>
    </div>
  );
}
