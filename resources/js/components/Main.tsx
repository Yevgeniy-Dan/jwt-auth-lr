import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useAppDispatch } from "../hooks/redux";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import store from "../store";
import App from "./Layout/App";

const Main = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );
};
export default Main;

// DOM element
if (document.getElementById("root")) {
    ReactDOM.render(<Main />, document.getElementById("root"));
}
