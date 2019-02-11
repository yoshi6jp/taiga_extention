import React from 'react';
import { Chart } from './Chart';
import { Controller } from './Controller';
import { UserTasks } from './UserTasks';
import { UnEstimatedTasks } from './UnEstimatedTasks';
import { Provider } from './Provider';
export const App = () => (
  <div className="container">
    <Provider>
      <Controller />
      <UserTasks />
      <UnEstimatedTasks />
      <Chart />
    </Provider>
  </div>
);
export default App;
