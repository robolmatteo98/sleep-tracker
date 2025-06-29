import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type SleepQualityBarChartProps = {
  array: number[];
  label: string;
  measure: string;
}

const SleepQualityBarChart = ({ array, label, measure } : SleepQualityBarChartProps) => {
  // Options
  const labels = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']
  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: array,
        backgroundColor: 'rgba(99,210,151, 0.6)',
        borderColor: 'rgba(47,133,90, 1)',
        borderWidth: 1,
      },
    ],
  }
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: label + ' settimanale (Bar Chart)',
        color: '#fff', // Titolo chiaro
      },
      legend: {
        labels: {
          color: '#fff', // Colore delle etichette della legenda
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff', // Etichette asse X
        },
        grid: {
          color: '#444', // Linee griglia asse X
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: measure,
          color: '#fff', // Titolo asse Y
        },
        ticks: {
          color: '#fff', // Etichette asse Y
        },
        grid: {
          color: '#444', // Linee griglia asse Y
        },
      },
    },
  }  

  // Render
  return (
    <div style={{ width: '600px', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default SleepQualityBarChart;