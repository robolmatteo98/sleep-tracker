import axios, { AxiosError } from "axios";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";

import "./Details.css";
import Button from "../../components/button/Button";
import { faBackward, faPieChart, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PercentageType, SleepData } from "../../types/entities";
import { SleepDataResponse } from "../../types/responses";

import { getPercentageValues } from "../../utils/function";
import AreaChart from "../../components/CHARTS/areaChart/AreaChart";

const stages = ["REM", "Deep", "Light", "Awake"];

type DetailsProps = {
  userId: number | null
  date: string | null
  setClickDetails: React.Dispatch<React.SetStateAction<boolean>>
}

const Details = ({ userId, date, setClickDetails } : DetailsProps) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visualizzazioneTabellare, setVisualizzazioneTabellare] = useState<boolean>(false);
  const [percetage, setPercentage] = useState<PercentageType[]>([]);

  // References
  const isInitialized = useRef(false);

  // Methods
  const fromDataToSleepData = (data: SleepDataResponse) => {
    const sleepData: SleepData[] = data.data.map(item => ({
      id: item.id,
      _timestamp: DateTime.fromISO(item.timestamp).toFormat('HH:mm'),
      _sleep_stage: item.sleep_stage
    }));

    setSleepData(sleepData);
    setPercentage(getPercentageValues(stages, sleepData));
  }

  const fetchData = () => {
    setIsLoading(true);

    axios.get('http://localhost:5001/sleep_data_format', {
      params: {
        id: userId,
        date: date
      }
    })
    .then((res) => fromDataToSleepData(res.data))
    .catch((e: AxiosError) => {
      console.log(e);
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
    <>
      <section>
        <div className="details-header-container">
          <div className="width-button_home">
            <Button 
              onClick={() => setClickDetails(false)}
              text="Home Page"
              icon={faBackward}
            />
          </div>
          
    
          <div className="width-button_view">
            <Button 
              onClick={() => setVisualizzazioneTabellare(!visualizzazioneTabellare)}
              text="Visualizzazione tabellare"
              icon={faTable}
              selected={visualizzazioneTabellare}
            />
          </div>
        </div>

        <h1 className="statsTitle">
          <FontAwesomeIcon icon={faPieChart} />&nbsp;Sleep distribution
        </h1>
      </section>
      
      <div>
        {isLoading ? 'Sto caricando...' : error ? ("Errore nel caricamento dei dati: " + error) : ''}
  
  
        {/* Il grafico */}
        <AreaChart 
          sleepData={sleepData}
        />

        {/* Se la visualizzazione tabellare è attiva, mostriamo tabella di ogni dettaglio e una tabella accanto di percentuale */}
        {visualizzazioneTabellare ? (
          <div className="tabellare-container">
            <div className="table-container table-font">
              <table>
                <thead>
                  <tr>
                    <th>N</th>
                    <th>Time</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {sleepData.map((el, index) => (
                    <tr key={index} className={el._sleep_stage}>
                      <td>{index}</td>
                      <td>{el._timestamp}</td>
                      <td>{el._sleep_stage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="percentage-container">
              <table>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {percetage.map(el => (
                    <tr key={el.stage} className={el.stage}>
                      <td>{el.stage}</td>
                      <td>{el.perc.toFixed(2)} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        ) : null}
      </div>
    </>
  );   
}

export default Details;