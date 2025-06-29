import { useEffect, useState } from 'react';

import './Dashboard.css';

import Select from "../../components/select/Select";

import DayChart from '../trends/day/DayChart';
import WeekChart from '../trends/week/WeekChart';
import MonthChart from '../trends/month/MonthChart';

import { Option } from "../../types/entities";

const trends: Option[] = [
  { value: "1", label: "GIORNALIERO" },
  { value: "7", label: "SETTIMANALE" },
  { value: "31", label: "MENSILE" }
]

const Dashboard = () => {
  // States
  const [selectedTrend, setSelectedTrend] = useState<Option | null>(null);

  useEffect(() => {
    // Imposta il valore iniziale al primo render
    const defaultOption = trends.find(opt => opt.value === "1");
    if (defaultOption) setSelectedTrend(defaultOption);
  }, []);  

  // Render
  return (
    <div className="container">
      <div className="dashboard-header-container">
        <label htmlFor="trends">TREND: </label>
        <Select 
          name="trends"
          id="trends"
          options={trends}
          onChange={(option) => setSelectedTrend(option)}
          defaultValue='1'
        />
      </div>

      {
        selectedTrend 
        ? selectedTrend.value === "1" 
          ? <DayChart /> 
          : selectedTrend.value === "7"
            ? <WeekChart />
            : <MonthChart />
        : null
      }
    </div>
  )
}

export default Dashboard;