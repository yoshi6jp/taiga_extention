import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@material/switch/dist/mdc.switch.css";
import "@material/form-field/dist/mdc.form-field.css";
import "@rmwc/avatar/avatar.css";
import "@material/chips/dist/mdc.chips.css";
import "@material/linear-progress/dist/mdc.linear-progress.css";
import "@material/elevation/dist/mdc.elevation.css";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar-heatmap/dist/styles.css";
import { Provider } from "react-redux";
import { initialize } from "./app/initialize";
import { store } from "./app/store";
import { App } from "./App";
import { SideEffect } from "./app/SideEffect";
// import * as serviceWorker from "./serviceWorker";
import "./util/firebase";
ReactDOM.render(
  <Provider store={store}>
    <App />
    <SideEffect />
  </Provider>,
  document.getElementById("root")
);
initialize()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
