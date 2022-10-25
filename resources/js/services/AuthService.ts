import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import api from "../http/index";

export default class AuthService {
    static async login(
        email: string,
        password: string
    ): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>("/login", {
            email,
            password,
        });
    }

    static async register(
        name: string,
        email: string,
        password: string
    ): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>("/register", {
            name,
            email,
            password,
        });
    }

    static async logout(): Promise<void> {
        return api.post("/logoutall");
    }
}
