import React from "react";
import ReactDOM from "react-dom";

const Main = () => {
    return <h1>Hello</h1>;
};
export default Main;

// DOM element
if (document.getElementById("root")) {
    ReactDOM.render(<Main />, document.getElementById("root"));
}
