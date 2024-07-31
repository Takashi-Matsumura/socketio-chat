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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: SurveyResult;
  options: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  const labels = options;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "人数",
        data: [data.ans1, data.ans2, data.ans3, data.ans4, data.ans5],
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
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

  return <Bar data={chartData} options={chartOptions} />;
};

export default BarChart;
