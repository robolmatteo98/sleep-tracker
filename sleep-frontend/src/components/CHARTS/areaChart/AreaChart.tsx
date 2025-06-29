import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { useEffect, useState } from 'react';
import { SleepData } from "../../../types/entities";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

type AreaChartProps = {
  sleepData: SleepData[];
};

const COLORS: Record<string, string> = {
  Awake: "#ff5252",
  Light: "#63d297",
  Deep: "#2f855a",
  REM: "#d9f2e5",
};

const AreaChart = ({ sleepData }: AreaChartProps) => {
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartDatasets, setChartDatasets] = useState<any[]>([]);

  useEffect(() => {
    if (!sleepData.length) return;

    const sleepStages = ["Awake", "Light", "Deep", "REM"];

    // Costruisci le etichette per l'asse X solo nei cambi di fase
    const labels: string[] = [];
    const changeIndices: number[] = [];
    let prevStage = sleepData[0]._sleep_stage;

    sleepData.forEach((item, index) => {
      if (index === 0 || item._sleep_stage !== prevStage || index === sleepData.length - 1) {
        labels.push(item._timestamp);
        changeIndices.push(index);
        prevStage = item._sleep_stage;
      } else {
        labels.push('');
      }
    });

    const datasets = sleepStages.map((stage) => {
      const data = sleepData.map((item) =>
        item._sleep_stage === stage ? 1 : null
      );

      return {
        label: stage,
        data,
        fill: 'origin',
        backgroundColor: COLORS[stage],
        borderColor: COLORS[stage],
        borderWidth: 0,
        pointRadius: 0,
        tension: 0,
        stepped: true,
      };
    });

    setChartLabels(labels);
    setChartDatasets(datasets);
  }, [sleepData]);

  const data = {
    labels: chartLabels,
    datasets: chartDatasets,
  };

  const options = {
    scales: {
      y: {
        min: 0,
        max: 1.2,
        ticks: { display: false },
        grid: { display: false },
      },
      x: {
        ticks: {
          color: 'white',
          autoSkip: false,
          font: {
            size: 8,
          },
        },
        grid: {
          color: '#444'
        },
      },      
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div style={{ marginLeft: '1%' }}>
      <Line data={data} options={options} width={1800} height={200} />
    </div>
  );
};

export default AreaChart;