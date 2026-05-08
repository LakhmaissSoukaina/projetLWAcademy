import api from "./axios";

export const login = async (email, password) => {
  const res = await api.post("/login_check", {
    email,
    password,
  });

  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const register = async (data) => {
  return await api.post("/register", data);
};

export const getMe = async () => {
  const res = await api.get("/me");
  return res.data;
};