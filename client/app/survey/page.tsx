"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import BarChart from "../components/mychart";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { SurveyResult } from "../components/types";

const socket = io(
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
);

interface Survey {
  question: string;
  options: string[];
}

export default function Survey() {
  const [result, setResult] = useState<SurveyResult>({
    ans1: 0,
    ans2: 0,
    ans3: 0,
    ans4: 0,
    ans5: 0,
  });

  const [currentSurvey, setCurrentSurvey] = useState<Survey>({
    question: "",
    options: [],
  });

  useEffect(() => {
    // サーバからアンケートの更新を受信
    socket.on("survey-update", (survey: Survey) => {
      setCurrentSurvey(survey);
    });

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
      <div className="flex flex-col h-screen items-center mt-10">
        \<h1 className="text-3xl font-bold my-10">{currentSurvey.question}</h1>
        <div className="pt-5 space-x-2">
          {currentSurvey.options.map((option, index) => (
            <button
              key={index}
              onClick={() =>
                handleVote(
                  `ans${index + 1}` as
                    | "ans1"
                    | "ans2"
                    | "ans3"
                    | "ans4"
                    | "ans5"
                )
              }
              className="rounded-full px-4 py-2 border"
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex flex-col space-y-1 items-center w-full mt-10">
          <div className="mt-10 w-2/3">
            {currentSurvey.options.map((option, index) => (
              <div key={index} className="bg-gray-200 p-2 rounded-lg my-2">
                {option}: {result[`ans${index + 1}` as keyof SurveyResult]}
              </div>
            ))}
          </div>
          <div className="w-full mt-10">
            <BarChart data={result} options={currentSurvey.options} />
          </div>
        </div>
      </div>
    </div>
  );
}
