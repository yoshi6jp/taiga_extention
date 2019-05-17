import React from "react";
import { ToastContainer } from "react-toastify";
import { Controller } from "./components/Controller";
import { Provider } from "./Provider";
import { HashRouter, Route } from "react-router-dom";
import { OverView } from "./components/OverView";
import { PersonalPage } from "./components/PersonalPage";
import { ReactComponent as Tomato } from "./tomato.svg";
export const App = () => (
  <div className="container">
    <Tomato className="text-danger" />
    <Tomato className="text-danger" />
    <Tomato className="text-danger" />
    <Tomato className="text-danger" />
    <Tomato className="text-danger" />
    <Tomato className="text-danger" />
    <ToastContainer />
    <HashRouter>
      <Provider>
        <Controller />
        <Route exact path="/" component={OverView} />
        <Route exact path="/:uid" component={PersonalPage} />
      </Provider>
    </HashRouter>
  </div>
);
export default App;
