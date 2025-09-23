import React from "react";
import "./Input.css";

type InputProps = {
  name: string;
  withLabel?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const Input = ({
  name,
  withLabel = true,
  type = "text",
  value,
  onChange,
  placeholder,
}: InputProps) => {
  return (
    <div className="text">
      {withLabel && <label htmlFor={name}>{name}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;