import { useAppSelector } from "../hooks/redux";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import ServerError from "../components/Layout/Error";

const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
    const auth = useAppSelector((state) => state.auth);
    const location = useLocation();

    return (
        <>
            <ServerError />
            {auth.loading ? (
                <h2>Loading...</h2>
            ) : auth.isAuthenticated ? (
                children
            ) : (
                <Navigate to="/" replace state={{ from: location }} />
            )}
        </>
    );
};

export default RequireAuth;
