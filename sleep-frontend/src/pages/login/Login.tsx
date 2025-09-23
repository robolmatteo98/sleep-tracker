import { useState } from "react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";

import "./Login.css";

import { useNavigate } from "react-router";
import { useAuth } from "./Auth";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import axios, { AxiosError } from "axios";

const Login  = () => {
  // States
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Hooks
  const navigate = useNavigate();
  const { login } = useAuth();

  // Methods
  const isValidLogin = () => {
    axios.get('http://localhost:5001/auth', {
      params: {
        username: username,
        plainPassword: password
      },
    })
    .then((res) => {
      console.log(res.data)
      if(res.data === "OK") {
        login();
        console.log('navigate to dashboard');
        navigate('/dashboard');
      }
    })
    .catch((e: AxiosError) => {
      console.log(e);
    })
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="btnLogin">
          <Button 
            onClick={() => isValidLogin()}
            text="LOGIN"
            icon={faUser}
          />
        </div>
      </div>
      
    </div>
  )
}

export default Login;