import * as React from "react";
import { UserTasks } from "./UserTasks";
import { UnEstimatedTasks } from "./UnEstimatedTasks";
import { Chart } from "./Chart";

interface OwnProps {}

const OverView = (props: OwnProps) => (
  <>
    <UserTasks />
    <UnEstimatedTasks />
    <Chart />
  </>
);

export default OverView;
