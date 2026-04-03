import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);

// Predictions
export const submitPrediction = (data) => {
  // Use FormData if files are included
  if (data instanceof FormData) {
    return API.post("/predictions", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.post("/predictions", data);
};
export const getPredictions = () => API.get("/predictions");
export const getMyPredictions = () => API.get("/predictions/my");
export const getPredictionStats = () => API.get("/predictions/stats");
export const getMetrics = () => API.get("/metrics");
