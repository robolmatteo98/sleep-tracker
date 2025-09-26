import { useEffect, useState } from 'react';

import './Dashboard.css';

import Select from "../../components/select/Select";
import Button from '../../components/button/Button';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import DayChart from '../trends/day/DayChart';
import WeekChart from '../trends/week/WeekChart';
import MonthChart from '../trends/month/MonthChart';

import { Option } from "../../types/entities";

import { useAuth } from "../login/Auth";

const trends: Option[] = [
  { value: "1", label: "GIORNALIERO" },
  { value: "7", label: "SETTIMANALE" },
  { value: "31", label: "MENSILE" }
]

const Dashboard = () => {
  // States
  const [selectedTrend, setSelectedTrend] = useState<Option | null>(null);
  const [clickDetails, setClickDetails] = useState<boolean>(false);

  // Hooks
  const { logout } = useAuth();

  useEffect(() => {
    // Imposta il valore iniziale al primo render
    const defaultOption = trends.find(opt => opt.value === "1");
    if (defaultOption) setSelectedTrend(defaultOption);
  }, []);  

  // Render
  return (
    <div className="container">
      <div className="dashboard-header-container">
        <label htmlFor="trends" hidden={clickDetails}>TREND: </label>
        <Select 
          name="trends"
          id="trends"
          options={trends}
          onChange={(option) => setSelectedTrend(option)}
          defaultValue='1'
          hidden={clickDetails}
        />
        <Button 
          text='LOGOUT'
          icon={faRightFromBracket}
          onClick={logout}
          hidden={clickDetails}
        />
      </div>

      {
        selectedTrend 
        ? selectedTrend.value === "1" 
          ? <DayChart
              clickDetails={clickDetails}
              setClickDetails={setClickDetails}
            /> 
          : selectedTrend.value === "7"
            ? <WeekChart />
            : <MonthChart />
        : null
      }
    </div>
  )
}

export default Dashboard;