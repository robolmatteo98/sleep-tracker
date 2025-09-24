import { useState } from "react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";

import { useNavigate } from "react-router";

import axios, { AxiosError } from "axios";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import './SignUP.css';

const SignUP = () => {
  // States
  const [username, setUsername] = useState<string>("");
  const [password_1, setPassword_1] = useState<string>("");
  const [password_2, setPassword_2] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const navigate = useNavigate();

  // Methods
  const isValidSignUP = () => {
    if(password_1 === password_2) {
      axios.post('http://localhost:5001/signup', {
        username: username,
        plainPassword: password_1
      })
      .then((res) => {
        console.log(res.data);
        console.log('navigate to login');
        navigate('/login');
      })
      .catch((e: AxiosError) => {
        console.log(e);
        setErrorText(e.message);
      })
    } else {
      console.log('le due password non coincidono')
    }
  }

  // Render
  return (
    <div>
      <h1 className="title">SLEEP TRACKER</h1>
      <div className="login">
        <Input 
          name="USERNAME:"
          withLabel
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input 
          name="PASSWORD:"
          withLabel
          type="password"
          value={password_1}
          onChange={(e) => setPassword_1(e.target.value)}
        />
        <Input 
          name="RIPETI LA PASSWORD:"
          withLabel
          type="password"
          value={password_2}
          onChange={(e) => setPassword_2(e.target.value)}
        />
        <div className="btnSignUP">
          <Button 
            onClick={() => isValidSignUP()}
            text="SING UP"
            icon={faUser}
          />
        </div>
        <div className="errorText">
          {errorText}
        </div>
      </div>
    </div>
  )
}

export default SignUP;