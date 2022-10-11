import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// import config from "../config";
const client = axios.create({});

export interface IRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const interceptors = {
  request: (config: AxiosRequestConfig) => {
    const pass = ["nonce", "oauth", "public"];

    if (pass.filter((u) => config.url?.includes(u)).length !== 0) return config;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return Promise.reject("No Token");

    return {
      ...config,
      headers: {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
      },
    };
  },
  requestError: (error: AxiosError) => {
    if (typeof error === "string" && error === "No Token") {
      localStorage.clear();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
  response: (response: AxiosResponse) => response,
  responseError: (error: AxiosError) => {
    const originalRequest = error.config as IRequestConfig;

    if (typeof error === "string" && error === "No Token") {
      localStorage.clear();
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) return Promise.reject(error);

      return axios
        .post("/api/oauth/token", {
          grantType: "refresh_token",
          refreshToken: refresh_token,
        })
        .then((resp) => {
          const { access_token, refresh_token, refresh_expires_in } = resp.data;
          const currentTimestamp = new Date().getTime();
          const refreshTokenExpiresAt =
            currentTimestamp + Number(refresh_expires_in);
          localStorage.setItem("access_token", access_token as string);
          localStorage.setItem("refresh_token", refresh_token as string);
          localStorage.setItem(
            "refresh_token_expires_at",
            refreshTokenExpiresAt.toString()
          );

          return client({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              authorization: `Bearer ${access_token as string}`,
            },
          });
        })
        .catch((error) => {
          localStorage.clear();
          return false;
        })
        .finally(() => {
          window.location.reload();
        });
    }
    return Promise.reject(error);
  },
};

client.interceptors.request.use(
  interceptors.request,
  interceptors.requestError
);
client.interceptors.response.use(
  interceptors.response,
  interceptors.responseError
);

export default client;
