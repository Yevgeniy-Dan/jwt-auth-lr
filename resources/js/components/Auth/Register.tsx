import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { register } from "../../store/auth/auth-actions";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import ServerError from "../Layout/Error";

const Register: React.FC = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const auth = useAppSelector((state) => state.auth);

    const loginInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const signInHandle = async (event: React.FormEvent) => {
        event.preventDefault();

        dispatch(
            register(
                nameInputRef.current!.value,
                loginInputRef.current!.value,
                passwordInputRef.current!.value
            )
        );
    };

    useEffect(() => {
        const origin = location.state?.from?.pathname || "/dashboard";
        if (auth.isAuthenticated) navigate(origin);
    }, [auth.isAuthenticated, navigate, location]);

    return (
        <Container
            className={` d-flex  justify-content-center align-items-center`}
        >
            <Form onSubmit={signInHandle} className="form">
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        ref={nameInputRef}
                        type="name"
                        placeholder="Enter name"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        ref={loginInputRef}
                        type="email"
                        placeholder="Enter email"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        ref={passwordInputRef}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Group>

                <ServerError />

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </Container>
    );
};

export default Register;
