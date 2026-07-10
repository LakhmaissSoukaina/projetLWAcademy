import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api"
});

// 🔐 Intercepteur (AJOUT AUTOMATIQUE DU TOKEN)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  console.log("🔑 Token from localStorage:", token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization header set:", config.headers.Authorization);
    console.log("✅ Full config:", config);
  } else {
    console.log("❌ No token found in localStorage");
  }

  return config;
});

export default api;