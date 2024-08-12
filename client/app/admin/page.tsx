"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import BarChart from "../components/mychart";
import QRCode from "qrcode.react";
import { SurveyResult } from "../components/types";

const socket = io(
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
);

export default function AdminPage() {
  const [currentSurvey, setCurrentSurvey] = useState({
    question: "",
    options: [],
  });

  useEffect(() => {
    socket.on("survey-update", (survey) => {
      setCurrentSurvey(survey);
    });

    return () => {
      socket.off("survey_result");
    };
  }, []);

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

  const currentUrl = ""; //window.location.href.replace("/admin", "");

  const handleSurveyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setSelectedSurvey(event.target.value);
  };

  const submitSurveySelection = async () => {
    try {
      const response = await fetch("http://localhost:5000/select-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ surveyId: selectedSurvey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error selecting survey");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error details:", error);
      alert("Error selecting survey");
    }
  };

  const [selectedSurvey, setSelectedSurvey] = useState("survey1");
  const handleToggle = (survey: string) => {
    setSelectedSurvey(survey);
    socket.emit("select_survey", survey);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col h-screen items-center justify-center">
        <h1 className="text-5xl font-bold mb-10">Admin Survey Control</h1>
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
        {/* <div className="flex space-x-10 items-center mb-10">
          <div className="flex flex-col items-center">
            <QRCode value={currentUrl} />
            <h3>{currentUrl}</h3>
          </div>
          <button
            className="bg-black text-white border-2 p-2 h-10"
            onClick={resetSurvey}
          >
            Reset Survey
          </button>
          <div className="flex">
            <select value={selectedSurvey} onChange={handleSurveyChange}>
              <option value="survey1">アンケート１</option>
              <option value="survey2">アンケート２</option>
            </select>
            <button
              className="bg-black text-white border rounded-full px-4 py-2"
              onClick={submitSurveySelection}
            >
              Submit
            </button>
            <h2>Current Survey</h2>
            <p>{currentSurvey.question}</p>
            <ul>
              {currentSurvey.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
        </div>
        <BarChart data={result} options={currentSurvey.options} /> */}
      </div>
    </div>
  );
}
