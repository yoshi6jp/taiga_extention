import React from 'react';
import { Chart } from './Chart';
import { Controller } from './Controller';
import { UserTasks } from './UserTasks';
import { UnSettingTasks } from './UnSettingTasks';
import { Provider } from './Provider';
export const App = () => (
  <div className="container">
    <Provider>
      <Controller />
      <UserTasks />
      <UnSettingTasks />
      <Chart />
    </Provider>
  </div>
);
export default App;
