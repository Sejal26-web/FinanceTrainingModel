import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

export const submitPrediction = (data) => API.post("/predictions", data);
export const getPredictions = () => API.get("/predictions");
export const getPredictionStats = () => API.get("/predictions/stats");
export const getMetrics = () => API.get("/metrics");
