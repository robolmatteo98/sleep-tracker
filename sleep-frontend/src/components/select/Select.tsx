import { useEffect, useState, useRef } from "react";
import "./Select.css";
import { Option } from "../../types/entities";

type SelectProps = {
  name?: string;
  id?: string;
  options: Option[];
  onChange?: (option: Option) => void;
  defaultValue?: string;
  hidden?: boolean;
};

const Select = ({ name = "", id = "", options, onChange, defaultValue, hidden }: SelectProps) => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(options.find((opt) => opt.value === defaultValue));

  // Hooks
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Methods
  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  if (hidden) return null;

  // Render
  return (
    <div className="custom-select-container" ref={ref} id={id} hidden={hidden}>
      <div className="custom-select-box" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption?.label || "Select..."}
        <span className={`select-arrow ${isOpen ? "open" : ""}`}>&#9660;</span>
      </div>
      {isOpen && (
        <div className="custom-options">
          {options.map((option, index) => (
            <option
              key={index}
              className={`custom-option ${
                selectedOption?.value === option.value ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </option>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;