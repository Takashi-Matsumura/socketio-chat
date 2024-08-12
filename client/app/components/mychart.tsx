import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { SurveyResult } from "../components/types";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  results: number[];
  options: string[];
}

const BarChart: React.FC<BarChartProps> = ({ results, options }) => {
  const [chartData, setChartData] = useState({
    labels: options,
    datasets: [
      {
        label: "人数",
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
    console.log("rerendering... results", results);
    setChartData({
      labels: options,
      datasets: [
        {
          label: "人数",
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
  }, [results, options]);

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

  return <Bar data={chartData} options={chartOptions} />;
};

export default BarChart;
