import { AppDispatch, RootState } from "..";
import { authActions } from "./auth-slice";
import AuthService from "../../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../../models/response/AuthResponse";
import { API_URL } from "../../http";

const getErrorMessages = (message: string | {}): string[] => {
    if (typeof message === "string") {
        return [`${message}`];
    }

    const messagesArr: string[] = Object.values(message);

    return messagesArr.flat();
};

export const register = (name: string, email: string, password: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await AuthService.register(name, email, password);
            dispatch(
                authActions.login({
                    username: response.data.username,
                    accessToken: response.data.access_token,
                })
            );
        } catch (error: any) {
            let message: string[] | {} = error.response?.data?.message;

            dispatch(
                authActions.showError({
                    message: getErrorMessages(message),
                })
            );
        }
    };
};

export const login = (email: string, password: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await AuthService.login(email, password);
            dispatch(
                authActions.login({
                    username: response.data.username,
                    accessToken: response.data.access_token,
                })
            );
        } catch (error: any) {
            let message: any = error.response?.data?.message;

            dispatch(
                authActions.showError({
                    message: getErrorMessages(message),
                })
            );
        }
    };
};

export const logout = () => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await AuthService.logout();
            dispatch(authActions.logout());
        } catch (error: any) {
            let errorMessage: string =
                error.response?.data?.message || "Unexpected error";
            dispatch(
                authActions.showError({
                    message: [`${errorMessage}`],
                })
            );
        }
    };
};

export const checkAuth = () => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await axios.post<AuthResponse>(
                `${API_URL}/refresh`,
                null,
                {
                    withCredentials: true,
                }
            );
            dispatch(
                authActions.login({
                    username: response.data.username,
                    accessToken: response.data.access_token,
                })
            );
        } catch (error) {
            dispatch(
                authActions.showError({
                    message: [],
                })
            );
        }
    };
};
