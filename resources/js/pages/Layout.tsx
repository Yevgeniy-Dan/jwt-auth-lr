import React from "react";
import { Outlet } from "react-router-dom";
import MainHeader from "../components/Layout/MainHeader";

const Layout: React.FC = () => {
    return (
        <div className="container">
            <MainHeader />
            <main className="container">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
