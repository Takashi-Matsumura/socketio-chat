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
  male: number;
  female: number;
}

interface BarChartProps {
  data: SurveyResult;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = {
    labels: ["男性", "女性"],
    datasets: [
      {
        label: "人数",
        data: [data.male, data.female],
        backgroundColor: ["#36A2EB", "#FF6384"],
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
