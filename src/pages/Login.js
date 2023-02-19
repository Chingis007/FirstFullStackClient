import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  let navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const login = () => {
    const data = { username: username, password: password };
    axios
      .post(
        "https://firstfullstackapi-production.up.railway.app/auth/login",
        data
      )
      .then((response) => {
        if (response.data.error) alert(response.data.error);
        else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
          navigate("/");
        }
      });
  };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;
