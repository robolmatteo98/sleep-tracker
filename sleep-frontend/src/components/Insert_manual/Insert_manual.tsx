import { useState } from "react";
import Button from "../button/Button";
import Select from "../select/Select";
import DatePickerWithClear from "../datepicker/DatePicker";

import { Option } from "../../types/entities";
import axios, { AxiosError } from "axios";
import { DateTime } from "luxon";

import './Insert_manual.css';

const stages: Option[] = [
  { label: "REM", value: "1"},
  { label: "Deep", value: "2"},
  { label: "Light", value: "3"},
  { label: "Awake", value: "4"}
];

type Insert_manualProps = {
  userId: number | null
  day: string | null
  startDate: string
  endDate: string
  setOpenInsertManual: React.Dispatch<React.SetStateAction<boolean>>;
}

const Insert_manual = ({ userId, day, startDate, endDate, setOpenInsertManual } : Insert_manualProps) => {
  const [dalle, setDalle] = useState<Date | null>(day ? DateTime.fromISO(day).toJSDate() : DateTime.now().toJSDate());
  const [alle, setAlle] = useState<Date | null>(day ? DateTime.fromISO(day).toJSDate() : DateTime.now().toJSDate());
  const [stage, setStage] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const addSleepStages = () => {
    axios.post('http://localhost:5001/insert-data', {
      userId: userId,
      day: day,
      dalle: dalle
        ? DateTime.fromJSDate(dalle).toFormat("yyyy-MM-dd'T'HH:mm:ss")
        : null,
      alle: alle
        ? DateTime.fromJSDate(alle).toFormat("yyyy-MM-dd'T'HH:mm:ss")
        : null,
      stage: stage
    })
    .then(res => setStatus(res.data.message + " " + res.data.count + " record."))
    .catch((e: AxiosError)=> console.error(e.message))
  }

  const confrontoDATE = () => {
    if (!dalle || !alle) return false;

    const userStart = DateTime.fromFormat(startDate, 'dd/MM/yyyy HH:mm');
    const userEnd = DateTime.fromFormat(endDate, 'yyyy-MM-dd HH:mm');
    const newStart = DateTime.fromJSDate(dalle);
    const newEnd = DateTime.fromJSDate(alle);

    console.log(startDate)
    console.log(userStart, newStart)

    if(newEnd >= userStart || newStart <= userEnd) return true;
    if(newStart <= userStart && newEnd >= userEnd) return true;
    if(newStart >= userStart && newEnd <= userEnd) return true;
    return false;
  };

  const addDisable = () => {
    return !stage || !dalle || !alle || confrontoDATE();
  };


  // Render
  return (
    <div className="manual-box">
      <h2 className="manual-title">Inserimento manuale sonno</h2>

      <div>
        Inizio sonno: {startDate}
      </div>
      <div>
        Fine sonno: {endDate}
      </div>

      <div className="manual-input-row">
        <DatePickerWithClear 
          name="Dalle Ore:"
          onChange={(e) => setDalle(e)}
          value={dalle}
          withTime
        />
        <DatePickerWithClear 
          name="Alle Ore:"
          onChange={(e) => setAlle(e)}
          value={alle}
          withTime
        />
      </div>

      <div className="manual-input-row selectBox">
        <Select 
          options={stages}
          onChange={(e) => setStage(e.label)}
        />
      </div>

      <div className="manual-buttons">
        <Button text="Aggiungi" onClick={addSleepStages} disable={addDisable()} />
        <Button text="Indietro" onClick={() => setOpenInsertManual(false)} />
      </div>

      {status && <div className="manual-status">{status}</div>}
    </div>
  );
}

export default Insert_manual;