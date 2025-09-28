import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import "./Button.css";

type ButtonProps = {
  name?: string;
  onClick?: () => void;
  text?: string;
  icon?: IconDefinition;
  selected?: boolean | null;
  hidden?: boolean;
  disable?: boolean;
}

const Button = ({
  name,
  onClick,
  text,
  icon,
  selected = null,
  hidden,
  disable
} : ButtonProps) => {

  if (hidden) return null;

  // Render
  return (
    <button
      className={selected === null ? "button-core" : selected ? "button-selected" : "button-not-selected"}
      name={name}
      onClick={onClick}
      disabled={disable}
    >
      {icon ? (<FontAwesomeIcon icon={icon} />) : null}&nbsp;{text}
    </button>
  )
}

export default Button;