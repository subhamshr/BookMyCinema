import axios from "axios";
import { API_URL } from "../constants/index";

export const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});
