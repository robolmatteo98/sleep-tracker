import React from 'react';
import './BarChart.css';

import { preparePieData } from '../../../utils/function';

import { SleepData } from '../../../types/entities';

const COLORS = ["#63d297", "#ff5252", "#2f855a", "#d9f2e5"];

const BarChart = ({ sleepData } : { sleepData: SleepData[] }) => {
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