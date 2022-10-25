import React from "react";
import { Form, Alert } from "react-bootstrap";
import { useAppSelector } from "../../hooks/redux";

const ServerError: React.FC = () => {
    const error = useAppSelector((state) => state.auth.authError);

    return (
        <>
            {error && (
                <Form.Group className="mb-3">
                    {error.map((e, index) => (
                        <Alert key={e + index} variant="danger">
                            {e}
                        </Alert>
                    ))}
                </Form.Group>
            )}
        </>
    );
};

export default ServerError;
