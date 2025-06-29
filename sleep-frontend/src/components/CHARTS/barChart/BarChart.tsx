import React from 'react';
import './BarChart.css';

import { formatMinutes } from '../../../utils/function';

import { SleepData } from '../../../types/entities';

const COLORS = ["#63d297", "#ff5252", "#2f855a", "#d9f2e5"];

const BarChart = ({ sleepData } : { sleepData: SleepData[] }) => {
  // Methods
  const preparePieData = (data: SleepData[]) => {
    const sleepStages: Record<string, number> = {};

    data.forEach((item, index) => {
      if (index < data.length - 1) {
        const duration = (new Date(data[index + 1]._timestamp).getTime() - new Date(item._timestamp).getTime()) / 60000;
        sleepStages[item._sleep_stage] = (sleepStages[item._sleep_stage] || 0) + duration;
      }
    });

    return Object.keys(sleepStages).map((stage) => ({
      name: stage + ": " + formatMinutes(sleepStages[stage]),
      value: sleepStages[stage]
    }));
  };

  const getTotal = (values: number[]) => values.reduce((total, n) => total + n, 0);
  const getPercentage = (value: number, total: number) => (value * 100) / total

  const pieData = preparePieData(sleepData);
  const values = pieData.map(item => item.value);

  const total = getTotal(values);

  // Render
  return (
    <div className="bar_wrapper">
      {values.map((el, index) => {
        const color = COLORS[index]
        return (
          <React.Fragment key={index}>
            <div
              className="bar_fill"
              style={{ width: getPercentage(el, total) + '%', backgroundColor: color }}
            ></div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default BarChart;