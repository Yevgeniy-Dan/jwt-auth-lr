import React from "react";
import MainHeader from "../components/Layout/MainHeader";

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div>
            <MainHeader />
            {children}
        </div>
    );
};

export default RootLayout;
