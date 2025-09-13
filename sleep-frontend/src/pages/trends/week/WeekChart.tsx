import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

import { SleepWeekDataResponse } from "../../../types/responses";
import { SleepWeekData } from "../../../types/entities";
import SleepQualityBarChart from "../../../components/CHARTS/lineChart/LineChart";

import "./WeekChart.css"

const WeekChart = () => {
  // States
  const [quality, setQuality] = useState<number[]>([]);
  const [points, setPoints] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // References
  const isInitialized = useRef(false);

  const fromSleepWeekDataResponse = (sleepWeekData: SleepWeekDataResponse) => {
    const response: SleepWeekData[] = sleepWeekData.data.map(el => ({
      id: el.id,
      quality: el.quality,
      totalSleep: el.totalSleep
    }))

    setQuality(response.map(el => el.quality));
    setPoints(response.map(el => el.totalSleep));
  }

  const fetchData = () => {
    setIsLoading(true);

    axios.get('http://localhost:5001/total_sleep_last_week')
    .then((res) => {
      fromSleepWeekDataResponse(res.data);
    })
    .catch((e: AxiosError) => {
      setError(e.message);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  useEffect(() => {
    if(isInitialized.current) return;
    isInitialized.current = true;
    fetchData();
  }, []);


  // Render
  return (
    <div>
      {error 
        ? (<div>Errore</div>)
        : isLoading 
          ?  (<div>Sto caricando...</div>)
          : 
          <div className="week-container">
            <div className="quality-chart">
              <SleepQualityBarChart array={quality} label="Qualità del Sonno" measure="Qualità (%)" />
            </div>
            <div className="points-chart">
              <SleepQualityBarChart array={points} label="Minuti di Sonno" measure="Punteggio" />
            </div>
          </div>
      }
    </div>
  )
}

export default WeekChart;