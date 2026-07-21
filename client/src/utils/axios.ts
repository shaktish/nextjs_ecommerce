// src/utils/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api/bff",
  withCredentials: true, //include cookies in every request
});

export default axiosClient;
