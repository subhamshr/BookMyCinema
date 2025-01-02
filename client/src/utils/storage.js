import { jwtDecode } from "jwt-decode";

export const setToken = (key = "token", value) => {
  const data = typeof value === "string" ? value : JSON.stringify(value);
  return localStorage.setItem(key, data);
};
export const getToken = (key = "token") => {
  return localStorage.getItem(key);
};
export const removeToken = (key = "token") => {
  return localStorage.removeItem(key);
};

export const setCurrentUser = (info) => {
  const token = getToken();
  const { data } = jwtDecode(token);
  data.id = info;
  setToken("currentUser", data);
};

