import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Controller } from "./components/Controller";
import { Provider } from "./Provider";
import { HashRouter, Route } from "react-router-dom";
import { OverView } from "./components/OverView";
import { PersonalPage } from "./components/PersonalPage";
import { Pomodoro } from "./components/Pomodoro";
import { BoardPage } from "./features/page/BoardPage";
import { BridgeEffect } from "./app/BridgeEffect";
import { Alarm } from "./features/alarm";
export const App: React.FC = () => (
  <div className="container-xl">
    <ToastContainer className="toast-top" />
    <HashRouter>
      <Provider>
        <Pomodoro />
        <Alarm />
        <Controller />
        <Route exact path="/" component={OverView} />
        <Route exact path="/board" component={BoardPage} />
        <Route exact path="/users/:uid" component={PersonalPage} />
        <Route exact path="/users/:uid/:total_hours" component={PersonalPage} />
        <BridgeEffect />
      </Provider>
    </HashRouter>
  </div>
);
