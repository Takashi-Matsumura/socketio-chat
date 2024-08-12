"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import BarChart from "../components/mychart";
import QRCode from "qrcode.react";
import { SurveyData, SurveyResult } from "../components/types";
import SurveyComponent from "../components/surveys/SurveyComponent";

const socket = io(
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
);

export default function AdminPage() {
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState("survey1");

  const currentUrl = ""; //window.location.href.replace("/admin", "");

  useEffect(() => {
    socket.on("survey_changed", (data) => {
      console.log(data);
      setSurvey(data);
    });

    return () => {
      socket.off("survey_result");
    };
  }, []);

  const handleToggle = (survey: string) => {
    setSelectedSurvey(survey);
    socket.emit("select_survey", survey);
  };

  const url = window.location.href.replace("/admin", "");

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex items-center my-20">
        <QRCode value={url} size={64} className="mr-4" />
        <h1 className="text-5xl font-bold">Admin Survey Control</h1>
        <QRCode value={url} size={64} className="ml-4" />
      </div>
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 ${
            selectedSurvey === "survey0"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleToggle("survey0")}
        >
          Survey 0
        </button>
        <button
          className={`px-4 py-2 ${
            selectedSurvey === "survey1"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleToggle("survey1")}
        >
          Survey 1
        </button>
        <button
          className={`px-4 py-2 ${
            selectedSurvey === "survey2"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleToggle("survey2")}
        >
          Survey 2
        </button>
      </div>
      <div className="flex flex-col h-screen w-full items-center p-3">
        {survey?.id != null && (
          <SurveyComponent
            data={survey}
            socket={socket}
            surveyVisible={false}
          />
        )}
      </div>
    </div>
  );
}
