import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/auth-actions";
import { authActions } from "../../store/auth/auth-slice";

const MainHeader: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

    const loginHandler = () => {
        dispatch(authActions.showError({ message: null }));
        navigate("/login", { replace: true });
    };

    const signInHandler = () => {
        dispatch(authActions.showError({ message: null }));
        navigate("/register");
    };

    const logoutHandle = (event: React.FormEvent) => {
        event.preventDefault();

        dispatch(logout());
    };

    return (
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <p className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                <span className="fs-4">JWT-AUTH</span>
            </p>

            <div className="col-md-3 text-end">
                {!isAuth ? (
                    <>
                        <button
                            onClick={loginHandler}
                            type="button"
                            className="btn btn-outline-primary me-2"
                        >
                            Login
                        </button>
                        <button
                            onClick={signInHandler}
                            type="button"
                            className="btn btn-warning"
                        >
                            Sign-up
                        </button>
                    </>
                ) : (
                    <button
                        onClick={logoutHandle}
                        type="button"
                        className="btn btn-warning"
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
};

export default MainHeader;
