import { SleepMonthData } from "../../../types/entities";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";

// Registrazione dei componenti di Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title
);

const LineChartClassic = ({ chartData } : { chartData: SleepMonthData[] } ) => {
  // Options
  const data = {
    labels: chartData.map((_, index) => index + 1),
    datasets: [
      {
        label: "Qualità del sonno",
        data: chartData.map(item => item.quality),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Minuti di sonno",
        data: chartData.map(item => item.totalSleep),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff" // colore del testo della legenda
        }
      },
      title: {
        display: true,
        text: "Andamento del sonno nel mese",
        color: "#ffffff" // titolo bianco
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Giorni (dd)",
          color: '#fff',
        },
        ticks: {
          color: "#ffffff", // colore delle etichette sull'asse X
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // griglia chiara
        },
      },
      y: {
        title: {
          display: true,
          text: "Punteggio",
          color: '#fff',
        },
        ticks: {
          color: "#ffffff", // colore delle etichette sull'asse Y
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // griglia chiara
        },
      },
    },
  };  

  // Render
  return (
    <div>
      <Line data={data} options={options} />
    </div>
  )
}

export default LineChartClassic;