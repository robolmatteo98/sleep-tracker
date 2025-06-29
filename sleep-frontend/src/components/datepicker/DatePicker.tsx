import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";
import { it } from "date-fns/locale/it";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";

type DatePickerProps = {
  name: string;
  onChange: (date: Date | null) => void;
  disable?: boolean;
  defaultValue?: Date | null;
}

const DatePickerWithClear = ({
  name,
  onChange,
  disable,
  defaultValue,
} : DatePickerProps) => {
  // States
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Hooks
  useEffect(() => {
    if (defaultValue) setSelectedDate(defaultValue);
    else setSelectedDate(null);
  }, [defaultValue]);

  // Methods
  const handleChangeDateMin = (value: Date | null) => value ? DateTime.fromJSDate(value).minus({ days: 1 }).toJSDate() : null;
  const handleChangeDateMax = (value: Date | null) => value ? DateTime.fromJSDate(value).plus({ days: 1 }).toJSDate() : null;
  const handleChangeData = (plus: boolean) => {
    const new_date = plus ? handleChangeDateMax(selectedDate) : handleChangeDateMin(selectedDate)
    setSelectedDate(new_date);
    onChange(new_date);
  }

  // Render
  return (
    <>
      <div className="datepicker-container">
        <button
          type="button"
          className="arrow"
          onClick={() => handleChangeData(false)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <DatePicker
          name={name}
          dateFormat="dd/MM/yyyy"
          selected={selectedDate}
          onChange={(date) => onChange(date)}
          locale={it}
          placeholderText="dd/MM/yyyy"
          disabled={disable}
          className="input-date"
        />

        <button
          type="button"
          className="arrow"
          onClick={() => handleChangeData(true)}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </>
  );
};

export default DatePickerWithClear;