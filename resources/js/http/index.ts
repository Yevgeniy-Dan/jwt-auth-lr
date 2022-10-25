import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import store from "../store";
import { authActions } from "../store/auth/auth-slice";

export const API_URL = "http://localhost:8000/api/auth";

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

const { dispatch, getState } = store;

api.interceptors.request.use((config) => {
    config!.headers!.Authorization = `Bearer ${getState().auth.accessToken}`;

    return config;
});

api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            originalRequest._isRetry = true;
            try {
                const response = await axios.post<AuthResponse>(
                    `${API_URL}/refresh`,
                    null,
                    {
                        withCredentials: true,
                    }
                );
                dispatch(
                    authActions.refreshAccessToken(response.data.access_token)
                );
                return api.request(originalRequest);
            } catch (error) {
                if (error.response.status === 401) {
                    dispatch(authActions.logout());
                }
            }
        }

        throw error;
    }
);
export default api;
