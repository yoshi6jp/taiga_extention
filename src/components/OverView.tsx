import * as React from "react";
import { UserTasks } from "./UserTasks";
import { UnEstimatedTasks } from "./UnEstimatedTasks";
import { NotAssignedTasks } from "./NotAssignedTasks";
import { OverviewChart } from "./OverviewChart";

export const OverView = () => (
  <>
    <UserTasks />
    <NotAssignedTasks />
    <br />
    <UnEstimatedTasks />
    <br />
    <OverviewChart />
  </>
);
