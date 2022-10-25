import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../Dashboard/Dashboard";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import Layout from "../../pages/Layout";
import RequireAuth from "../../pages/RequireAuth";

import NotFound from "../../pages/NotFound";

import { checkAuth } from "../../store/auth/auth-actions";

const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="login" />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                <Route
                    path="dashboard"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};
export default App;
