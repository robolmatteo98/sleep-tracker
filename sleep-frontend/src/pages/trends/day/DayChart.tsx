import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faFileAlt, faList, faMoon } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import axios from "axios";
import { useEffect, useState } from "react";

import Button from "../../../components/button/Button";
import DatePickerWithClear from "../../../components/datepicker/DatePicker";
import DoughnutChart from "../../../components/CHARTS/doughnutChart/Doughnut";
import BarChart from "../../../components/CHARTS/barChart/BarChart";

import { timeOfStage, formatMinutes, getPercentageValues } from "../../../utils/function";

import { PercentageType, SleepData } from "../../../types/entities";
import { SleepDataResponse } from "../../../types/responses";

import { useAuth } from "../../login/Auth";

import "./DayChart.css";

import InsertCSV from "../../../components/Insert_CSV/InsertCSV";
import Details from "../../details/Details";
import Insert_manual from "../../../components/Insert_manual/Insert_manual";

const stages = ["REM", "Deep", "Light", "Awake"];

const obiettivoIdealeSonno = 8 * 60;

type DayChartProps = {
  clickDetails: boolean
  setClickDetails: React.Dispatch<React.SetStateAction<boolean>>
}

const DayChart = ({ clickDetails, setClickDetails } : DayChartProps) => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState<Date | null>(DateTime.now().minus({ days: 1 }).toJSDate());
  const [percetage, setPercentage] = useState<PercentageType[]>([]);
  const [openInsertManual, setOpenInsertManual] = useState<boolean>(false);

  // Hooks
  const { userId } = useAuth();

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
    const _sleepData: SleepData[] = data.data.map(item => ({
      _timestamp: DateTime.fromISO(item.timestamp).toFormat('dd/MM/yyyy HH:mm'),
      _sleep_stage: item.sleep_stage
    }));

    console.log(_sleepData)
    setSleepData(_sleepData);
    setPercentage(getPercentageValues(stages, _sleepData));
  }

  const fetchSleepData = async (selectedDay: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get('http://localhost:5001/sleep_data_format', {
        params: {
          id: userId,
          date: DateTime.fromJSDate(selectedDay).toISODate()
        }
      });

      if (res.data.data.length === 0) {
        setError("Non esistono dati di questa giornata: " + DateTime.fromJSDate(selectedDay).toISODate());
        setSleepData([]);
        setPercentage([]);
      } else {
        fromDataToSleepData(res.data);
      }
    } catch (e: any) {
      setError(e.message || "Errore durante il fetch dei dati");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (day && !openInsertManual) fetchSleepData(day);
  }, [day, openInsertManual]);


  // Render
  return (
    <>
      {!clickDetails && !openInsertManual && (
        <div className="text-center">
          <DatePickerWithClear 
            name="date"
            onChange={(date) => handleChangeDay(date)}
            value={day}
            withBrackets
          />
        </div>
      )}

      {clickDetails ? (
        <Details 
          userId={userId}
          date={day ? DateTime.fromJSDate(day).toISODate() : null}
          setClickDetails={setClickDetails}
        />
      ) : openInsertManual ? (
        <Insert_manual 
          userId={userId}
          day={day ? DateTime.fromJSDate(day).toISODate() : null}
          startDate={sleepData[0]._timestamp}
          endDate={sleepData[sleepData.length - 1]._timestamp}
          setOpenInsertManual={setOpenInsertManual}
        />
      ) : (
        <>
          {error ? (
            <div>
              {error}
              <InsertCSV 
                date={day}
                setDay={setDay}
              />
            </div>
          ) : isLoading ? (
            <div>Caricamento</div>
          ) : (
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
              <div className="center">
                <div className="data-card-l">
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
                      onClick={() => setClickDetails(true)}
                      text="DETTAGLI"
                      icon={faFileAlt}
                    />
                  </div>
                </div>
                <div className="data-card-l manual">
                  <Button 
                    text="Inserisci manualmente"
                    onClick={() => setOpenInsertManual(true)}
                    icon={faList}
                  />
                </div>
              </div>
              <div className="right">
                <DoughnutChart sleepData={sleepData} />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

}

export default DayChart;