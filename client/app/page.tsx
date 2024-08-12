"use client";

import { useEffect, useState } from "react";

import io from "socket.io-client";
import SurveyComponent from "./components/surveys/SurveyComponent";
import { SurveyData } from "./components/types";

const socket = io(
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
);

export default function Home() {
  const [survey, setSurvey] = useState<SurveyData | null>(null);

  useEffect(() => {
    socket.on("survey_changed", (data) => {
      console.log(data);
      setSurvey(data);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full items-center p-3">
      <h1 className="text-3xl font-bold my-10">Survey App</h1>
      {survey?.id != null ? (
        <SurveyComponent data={survey} socket={socket} />
      ) : (
        <div className="flex w-2/3 justify-center">
          管理者がアンケートをセットするまでお待ちください...
        </div>
      )}
    </div>
  );
}
