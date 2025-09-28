import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import { SleepData } from '../../../types/entities';
import { preparePieData } from '../../../utils/function';

// Registrazione
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Opzioni grafico
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: 'white',
        boxHeight: 30,
        boxWidth: 5,
        padding: 15,
        font: {
          size: 14
        },
      },
    },
    title: {
      display: true,
      text: 'Distribuzione delle Fasi del Sonno',
      color: 'white',
      font: {
        size: 18
      },
      padding: {
        top: 5,
        bottom: 5
      }
    }
  }
};

// 🎨 Mappa colori stage → colore
const COLORS: Record<string, string> = {
  Light: "#63d297",
  Awake: "#ff5252",
  Deep: "#2f855a",
  REM: "#d9f2e5"
};

const DoughnutChart = ({ sleepData }: { sleepData: SleepData[] }) => {  
  const pieData = preparePieData(sleepData);

  const labels = pieData.map(item => item.name);
  const values = pieData.map(item => item.value);

  // Mappa i colori in base al nome dello stage
  const backgroundColors = labels.map(label => COLORS[label.split(":")[0]] || "#ccc");

  const data = {
    labels,
    datasets: [
      {
        label: 'Fasi del Sonno',
        data: values,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
        cutout: '70%'
      }
    ]
  };

  // Render
  return (
    <Doughnut data={data} options={options} plugins={[]} />
  );
};

export default DoughnutChart;