import * as React from "react";
import { UserTasks } from "./UserTasks";
import { UnEstimatedTasks } from "./UnEstimatedTasks";
import { OverviewChart } from "./OverviewChart";

export const OverView = () => (
  <>
    <UserTasks />
    <UnEstimatedTasks />
    <br />
    <OverviewChart />
  </>
);
