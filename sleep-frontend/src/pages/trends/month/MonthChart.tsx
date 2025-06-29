import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

import { SleepMonthData } from "../../../types/entities";
import { SleepMonthDataResponse } from "../../../types/responses";
import LineChartClassic from "../../../components/CHARTS/lineChartClassic/LineChartClassic";

const MonthChart = () => {
  const [chartData, setChartData] = useState<SleepMonthData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInitialized = useRef(false);

  const fromSleepMonthDataResponse = (sleepMonthData: SleepMonthDataResponse) => {
    const response: SleepMonthData[] = sleepMonthData.data.map(el => ({
      id: el.id,
      quality: el.quality,
      totalSleep: el.totalSleep
    }));
    setChartData(response);
  };

  const fetchData = () => {
    setIsLoading(true);
    axios.get('http://localhost:5001/total_sleep_last_month')
      .then((res) => {
        fromSleepMonthDataResponse(res.data);
      })
      .catch((e: AxiosError) => {
        setError(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    fetchData();
  }, []);

  if (isLoading) return <p>Caricamento dati...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
      {chartData ? (
        <LineChartClassic chartData={chartData} />
      ) : null}
    </div>
  );
};

export default MonthChart;