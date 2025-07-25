import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faFileAlt, faMoon } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import Button from "../../../components/button/Button";
import DatePickerWithClear from "../../../components/datepicker/DatePicker";
import DoughnutChart from "../../../components/CHARTS/doughnutChart/Doughnut";
import BarChart from "../../../components/CHARTS/barChart/BarChart";

import { timeOfStage, formatMinutes, getPercentageValues } from "../../../utils/function";

import { PercentageType, SleepData } from "../../../types/entities";
import { SleepDataResponse } from "../../../types/responses";

import "./DayChart.css";

const stages = ["REM", "Deep", "Light", "Awake"];

const DEV_day = DateTime.local(2025, 4, 10).toJSDate();
//const todaySleep = DateTime.now().minus({ days: 1 }).toJSDate();
const obiettivoIdealeSonno = 8 * 60;

const DayChart = () => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState<Date | null>(DEV_day);
  const [percetage, setPercentage] = useState<PercentageType[]>([]);

  // References
  const isInitialized = useRef(false);

  // Hooks
  const navigate = useNavigate();

  // Methods
  const getTimeSleep = (date: string) => DateTime.fromFormat(date, 'dd/MM/yyyy HH:mm').toFormat('HH:mm');

  const handleChangeDay = (date: Date | null) => {
    if(date) setDay(date);
  }
  
  const getPunteggio = (data: SleepData[]) => {
    if(sleepData && sleepData.length > 0) {
      const p_durata = (sleepData.length / obiettivoIdealeSonno) * 100;
      const p_fase = (((timeOfStage(data, "Deep") + timeOfStage(data, "REM")) / sleepData.length) * 100);
      const p_risvegli = (timeOfStage(data, "Awake") / sleepData.length) * 100;
      const p_finale = (p_durata * 0.5) + (p_fase * 0.5) - p_risvegli;
      return p_finale;
    } else {
      return null;
    }
  };

  const getQuality = (p_finale: number | null) => {
    if(p_finale) {
      switch(true) {
        case p_finale > 79: return "Ottima qualità del sonno.";
        case p_finale > 59: return "Qualità del sonno buona ma migliorabile.";
        case p_finale > 39: return "Sonno insufficiente, con margini di miglioramento significativi.";
        case p_finale > 0: return "Sonno scarso, è necessario un intervento per migliorare la qualità.";
        default: return "Errore nel calcolo del punteggio."
      }
    } else {
      return "Errore nel calcolo del punteggio."
    }
  }

  const fromDataToSleepData = (data: SleepDataResponse) => {
    const sleepData: SleepData[] = data.data.map(item => ({
      id: item.id,
      _timestamp: DateTime.fromISO(item._timestamp).toFormat('dd/MM/yyyy HH:mm'),
      _sleep_stage: item._sleep_stage
    }));

    setSleepData(sleepData);
    setPercentage(getPercentageValues(stages, sleepData));
  }

  const fetchData = () => {
    setIsLoading(true);

    // agganciare data nella richiesta
    axios.get('http://localhost:5001/sleep_data_format')
    .then((res) => fromDataToSleepData(res.data))
    .catch((e: AxiosError) => {
      setError(e.message);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  useEffect(() => {
    if (!day) return;
  
    if (day.getTime() === DEV_day.getTime()) {
      if (!isInitialized.current) {
        isInitialized.current = true;
        fetchData();
      }
      setError(null); // reset error if it's the valid day
    } else {
      setError("Non esistono dati di questa giornata: " + DateTime.fromJSDate(day).toISODate());
    }
  }, [day]);  

  // Render
  return (
    <>
      <div className="text-center">
        <DatePickerWithClear 
          name="date"
          onChange={(date) => handleChangeDay(date)}
          defaultValue={day}
        />
      </div>

      {
        error 
        ? (
          <div>
            {error}
          </div>
        )
        : isLoading
        ? (
          <div>
            Caricamento
          </div>
        )
        : (
          <div className="form">
            <div className="left">
              <p className="text-center text-bold">Insights e consigli</p>
              <div className="data-card-insights text-center">
                <p className="p-card-insights">
                  Scegli un orario regolare per andare a dormire.
                  L'orario ideale è tra le 22:00 e le 23:00.
                </p>
              </div>
              <div className="data-card-insights text-center">
                <p>
                  Evita stimoli prima di dormire. Evita di utilizzare telefoni, tablet e pc 1 ora prima di andare a dormire.
                </p>
              </div>
              <div className="data-card-insights text-center">
                <p>
                  Evita caffeina e bevande energetiche.
                </p>
              </div>
              <div className="data-card-insights text-center">
                <p>
                  Leggi un libro, fai meditazione, stretching leggero o ascolta musica tranquilla.
                </p>
              </div>
            </div>
            <div className="center data-card-l">
              <h1 className="text-center">
                PUNTEGGIO: {getPunteggio(sleepData)?.toFixed(0)}&nbsp;<FontAwesomeIcon icon={faMoon} />
                <p className="text-medium">{getQuality(getPunteggio(sleepData))}</p>
              </h1>
              <div className="form_center">
                <div className="left">
                  <FontAwesomeIcon icon={faBed} />&nbsp;{formatMinutes(sleepData.length)}
                </div>
                <div className="right">
                  {sleepData.length > 0 ? getTimeSleep(sleepData[0]._timestamp) : <></>} - {sleepData.length > 0 ? getTimeSleep(sleepData[sleepData.length - 1]._timestamp) : <></>}
                </div>
              </div>
              <div className="form_center">
                <div className="left">
                  <span>Ore di sonno</span>
                </div>
                <div className="right">
                  <BarChart sleepData={sleepData} />
                </div>
              </div>
              {percetage.length > 0 ? (
                <div className="form-bold">
                  <span className="Light-bold">Light: {percetage[2].perc.toFixed(0)}%</span>
                  <span className="Awake-bold">Awake: {percetage[3].perc.toFixed(0)}%</span>
                  <span className="Deep-bold">Deep: {percetage[1].perc.toFixed(0)}%</span>
                  <span className="REM-bold">REM: {percetage[0].perc.toFixed(0)}%</span>
                </div>
              ) : null}
             
              <div className="day-button-container">
                <Button 
                  onClick={() => navigate('/details')}
                  text="DETTAGLI"
                  icon={faFileAlt}
                />
              </div>
            </div>
            <div className="right">
              <DoughnutChart sleepData={sleepData} />
            </div>
          </div>
        )
      }
    </>
  );
}

export default DayChart;