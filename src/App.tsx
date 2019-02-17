import React from "react";
import { Controller } from "./Controller";
import { Provider } from "./Provider";
import { BrowserRouter, Route } from "react-router-dom";
import { PersonalPage } from "./PersonalPage";
import OverView from "./OverView";
export const App = () => (
  <div className="container">
    <Provider>
      <Controller />
      <BrowserRouter>
        <div>
          <Route exact path="/" component={OverView} />
          <Route exact path="/:uid" component={PersonalPage} />
        </div>
      </BrowserRouter>
    </Provider>
  </div>
);
export default App;
