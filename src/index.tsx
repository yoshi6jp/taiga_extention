import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap-css-only/css/bootstrap.css";
import "@material/switch/dist/mdc.switch.css";
import "@material/form-field/dist/mdc.form-field.css";
import "@rmwc/avatar/avatar.css";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar-heatmap/dist/styles.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
