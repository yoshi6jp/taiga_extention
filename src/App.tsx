import React from "react";
import { Controller } from "./components/Controller";
import { Provider } from "./Provider";
import { HashRouter, Route } from "react-router-dom";
import { OverView } from "./components/OverView";
import { PersonalPage } from "./components/PersonalPage";
export const App = () => (
  <div className="container">
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
