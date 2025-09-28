import React from 'react';
import './BarChart.css';

import { preparePieData } from '../../../utils/function';

import { SleepData } from '../../../types/entities';

const COLORS = [
  { stage: "Light", color: "#63d297" },
  { stage: "Awake", color: "#ff5252" },
  { stage: "Deep", color: "#2f855a" },
  { stage: "REM", color: "#d9f2e5" } 
]

const BarChart = ({ sleepData } : { sleepData: SleepData[] }) => {
  const getTotal = (values: number[]) => values.reduce((total, n) => total + n, 0);
  const getPercentage = (value: number, total: number) => (value * 100) / total

  const pieData = preparePieData(sleepData);
  console.log(pieData);
  const values = pieData.map(item => item.value);

  const total = getTotal(values);

  // Render
  return (
    <div className="bar_wrapper">
      {pieData.map((el, index) => {
        const color = COLORS.find(c => c.stage === el.name.split(":")[0])?.color ?? "white"
        return (
          <React.Fragment key={index}>
            <div
              className="bar_fill"
              style={{ width: getPercentage(el.value, total) + '%', backgroundColor: color }}
            ></div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default BarChart;