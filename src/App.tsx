import React from 'react';
import { Chart } from './Chart';
import { Controller } from './Controller';
import { UserTasks } from './UserTasks';
import { Provider } from './Provider';
export const App = () => (
  <div className="container">
    <Provider>
      <Controller />
      <UserTasks />
      <Chart />
    </Provider>
  </div>
);
export default App;
