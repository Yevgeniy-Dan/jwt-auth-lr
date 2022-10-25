import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    isAuthenticated: boolean;
    loading: boolean;
    authError: string[] | null;
    username: string;
    accessToken: string | null;
};

const initialState: InitialState = {
    isAuthenticated: false,
    loading: true,
    authError: null,
    username: "",
    accessToken: null,
};

const authSlice = createSlice({
    name: "authentication",
    initialState: initialState,
    reducers: {
        login(
            state,
            action: PayloadAction<{ username: string; accessToken: string }>
        ) {
            state.isAuthenticated = true;
            state.loading = false;
            state.authError = null;
            state.username = action.payload.username;
            state.accessToken = action.payload.accessToken;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.loading = false;
            state.authError = null;
            state.username = "";
            state.accessToken = null;
        },
        showError(state, action: PayloadAction<{ message: string[] | null }>) {
            state.loading = false;
            state.authError = action.payload?.message;
        },
        refreshAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice;
