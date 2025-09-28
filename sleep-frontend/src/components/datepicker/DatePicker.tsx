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
  value?: Date | null;
  withTime?: boolean;
  withBrackets?: boolean;
}

const DatePickerWithClear = ({
  name,
  onChange,
  disable,
  value,
  withTime,
  withBrackets
} : DatePickerProps) => {
  const handleChangeDateMin = (value: Date | null) => value ? DateTime.fromJSDate(value).minus({ days: 1 }).toJSDate() : null;
  const handleChangeDateMax = (value: Date | null) => value ? DateTime.fromJSDate(value).plus({ days: 1 }).toJSDate() : null;

  const handleChangeData = (plus: boolean) => {
    const new_date = value ? plus ? handleChangeDateMax(value) : handleChangeDateMin(value) : handleChangeDateMax(null);
    onChange(new_date);
  };

  return (
    <div className="datepicker-container">
      <button
        type="button"
        className="arrow"
        onClick={() => handleChangeData(false)}
        hidden={!withBrackets}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <DatePicker
        name={name}
        dateFormat={withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
        selected={value}
        onChange={onChange}
        locale={it}
        placeholderText={withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
        disabled={disable}
        className="input-date"
        showTimeSelect={withTime}
        timeIntervals={1}
      />

      <button
        type="button"
        className="arrow"
        onClick={() => handleChangeData(true)}
        hidden={!withBrackets}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default DatePickerWithClear;