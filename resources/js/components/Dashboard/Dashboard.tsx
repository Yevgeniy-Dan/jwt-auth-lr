import React, { useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useAppSelector } from "../../hooks/redux";
import { IUser } from "../../models/IUser";
import UserService from "../../services/UserService";

const Dashboard: React.FC = () => {
    const username = useAppSelector((state) => state.auth.username);

    const [accountDetails, setAccountDetails] = useState<IUser>();

    const getAccountDetails = async () => {
        const response = await UserService.fetchAccountDetails();
        setAccountDetails(response.data);
    };

    return (
        <div className="d-flex justify-content-center flex-column">
            <h2 className="text-center fs-1">Welcome, {username}</h2>

            <Container className="d-flex justi justify-content-center my-3">
                <Row className="accountDetails">
                    <Col
                        md={4}
                        className="d-flex flex-column justify-content-center justify-content-md-start"
                    >
                        <button
                            onClick={getAccountDetails}
                            className="btn btn-primary"
                        >
                            Get Account Details
                        </button>
                    </Col>
                    <Col md={8}>
                        {accountDetails && (
                            <Card className="form my-3 my-md-0 ">
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        Your ID: {accountDetails.id}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Name: {accountDetails.name}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Email: {accountDetails.email}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
