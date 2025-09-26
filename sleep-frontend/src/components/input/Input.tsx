import React from "react";
import "./Input.css";

type InputProps = {
  name: string;
  withLabel?: boolean;
  type?: string;
  accept?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const Input = ({
  name,
  withLabel = true,
  type = "text",
  accept,
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
        accept={accept}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;