import axios from "axios";
import type { AuthUserType } from "~/types/AuthType";
// import { API } from "~/config/api";

export const useMyFetch = function () {
  const config = useRuntimeConfig();
  const API_URL = config.public.API;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }

  const baseApi = axios.create({
    headers: headers,
    baseURL: API_URL,
  });

  baseApi.interceptors.request.use(config => {
    // const token = localStorage.getItem("_token");

    let authStore = JSON.parse(localStorage.getItem('AuthStore') || '{}') as { authUser: AuthUserType }
    const token = authStore?.authUser?.optional?.token || null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  })


  return baseApi;
};
