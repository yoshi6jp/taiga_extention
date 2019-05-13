import React from "react";
import { ToastContainer } from "react-toastify";
import { Controller } from "./components/Controller";
import { Provider } from "./Provider";
import { HashRouter, Route } from "react-router-dom";
import { OverView } from "./components/OverView";
import { PersonalPage } from "./components/PersonalPage";
export const App = () => (
  <div className="container">
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
