// frontend/src/api/auth.js
import api from "./axios";

export const login = async (email, password) => {
  const res = await api.post("/login_check", {
    email,
    password,
  });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const register = async (data) => {
  return await api.post("/register", data);
};

export const getMe = async () => {
  const res = await api.get("/me");
  return res.data;
};

export const loginWithGoogle = async (credential) => {
  const res = await api.post("/login/google", {
    credential: credential,
  });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

//  Nouvelle fonction pour la demande d'inscription professeur
export const submitProfessorApplication = async (formData) => {
  const response = await api.post("/auth/professor-application", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};