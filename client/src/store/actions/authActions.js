import axios from "axios";
import { returnError } from "./errorActions";

// Register action

export const register = user => dispatch => {
  dispatch({ type: "LOADING" });
  axios
    .post("/api/register", user, getConfig())
    .then(res => {
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
    })
    .catch(err => {
      dispatch(
        returnError(err.response.status, err.response.data.msg, "REGISTER_FAIL")
      );
      dispatch({ type: "REGISTER_FAIL" });
    });
};

// Login action

export const login = credentials => dispatch => {
  dispatch({ type: "LOADING" });
  axios
    .post("/api/login", credentials, getConfig())
    .then(res => {
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    })
    .catch(err => {
      dispatch(
        returnError(err.response.status, err.response.data.msg, "LOGIN_FAIL")
      );
      dispatch({ type: "LOGIN_FAIL" });
    });
};

// Logout action

export const logout = () => ({
  type: "LOGOUT_SUCCESS"
});

// Auth user based on JWT token
export const auth = () => dispatch => {
  dispatch({ type: "LOADING" });
  axios
    .get("/api/auth", getConfig())
    .then(res => {
      dispatch({ type: "USER_LOADED", payload: res.data });
    })
    .catch(err => {
      dispatch(returnError(err.response.status, err.response.data.msg));
      dispatch({ type: "AUTH_FAIL" });
    });
};

const getConfig = () => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    config.headers["x-auth-token"] = token;
  }

  return config;
};
