"use client";

import React, { useEffect, useState } from "react";
import { SurveyData, SurveyResult } from "../types";
import BarChart from "../mychart";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";

// Chart.jsの設定を登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface Props {
  data: SurveyData;
  socket: any;
}

const Survey0: React.FC<Props> = ({ data, socket }) => {
  const [survey, setSurvey] = useState<SurveyData>(data);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<number[]>([0, 0, 0, 0, 0]);
  const [chartData, setChartData] = useState({
    labels: survey.options,
    datasets: [
      {
        data: results,
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  });

  useEffect(() => {
    socket.on("receive_votes", (data: any) => {
      setResults(data);
    });
  }, []);

  useEffect(() => {
    setChartData({
      labels: survey.options,
      datasets: [
        {
          data: results,
          backgroundColor: [
            "#36A2EB",
            "#FF6384",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    });
  }, [results]);

  const handleClick = (index: number) => {
    socket.emit("send_vote", index);
    setAnswered(true);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "アンケート結果",
      },
    },
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex w-ful space-x-5">
        <p className="text-2xl w-1/3 ">アンケート:</p>
        <div className="flex flex-col w-full">
          <p className="text-3xl font-bold mb-5">{survey.question}</p>
          {!answered && <p className="text-2xl mb-10">{survey.description}</p>}
        </div>
      </div>
      {!answered ? (
        survey.options.map((option, index) => (
          <button
            onClick={() => handleClick(index)}
            key={index}
            className="bg-blue-500 text-white px-2 py-5 m-2 text-3xl"
          >
            {option}
          </button>
        ))
      ) : (
        <p className="text-3xl font-bold text-red-500 text-center">
          ご回答ありがとうございました
        </p>
      )}
      <div className="w-full mt-20">
        <Bar data={chartData} options={chartOptions} className="w-full" />
        {/* <BarChart results={results} options={survey.options} /> */}
      </div>
    </div>
  );
};

export default Survey0;
