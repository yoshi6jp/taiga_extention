import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Controller } from "./components/Controller";
import { Provider } from "./Provider";
import { HashRouter, Route } from "react-router-dom";
import { OverView } from "./components/OverView";
import { PersonalPage } from "./components/PersonalPage";
import { Pomodoro } from "./components/Pomodoro";
import { BridgeEffect } from "./app/BridgeEffect";
export const App: React.FC = () => (
  <div className="container">
    <ToastContainer className="toast-top" />
    <HashRouter>
      <Provider>
        <Pomodoro />
        <Controller />
        <Route exact path="/" component={OverView} />
        <Route exact path="/users/:uid" component={PersonalPage} />
        <BridgeEffect />
      </Provider>
    </HashRouter>
  </div>
);
