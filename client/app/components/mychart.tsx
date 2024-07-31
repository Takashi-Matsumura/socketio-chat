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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SurveyResult {
  ans1: number;
  ans2: number;
  ans3: number;
  ans4: number;
  ans5: number;
}

interface BarChartProps {
  data: SurveyResult;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = {
    labels: ["回答A", "回答B", "回答C"],
    datasets: [
      {
        label: "人数",
        data: [data.ans1, data.ans2, data.ans3],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const options = {
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

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
