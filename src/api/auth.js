// src/api/auth.js
import axios from "axios";

export const login = async (email, password) => {
  const response = await axios.post("http://localhost:8000/api/login_check", {
    email,
    password
  });

  localStorage.setItem("token", response.data.token);
  return response.data;
};