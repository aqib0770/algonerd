import axios from "axios";
console.log(import.meta.env.BASE_URL);
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});
