import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.SERVER_BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const access_token = localStorage.getItem("access_token");
    // const refresh_token = localStorage.getItem("refresh_token");

    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;

    return config;
  },
  function (error) {
    // Do something with request error
    console.log(error);
    return Promise.reject(error);
  }
);
