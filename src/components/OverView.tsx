import React, { useContext } from "react";
import { UserTasks } from "./UserTasks";
import { UnEstimatedTasks } from "./UnEstimatedTasks";
import { NotAssignedTasks } from "./NotAssignedTasks";
import { Chart } from "./Chart";
import { RootContext } from "../Provider";

export const OverView: React.FC = () => {
  const {
    state: { tasks }
  } = useContext(RootContext);
  return (
    <>
      <UserTasks />
      <NotAssignedTasks />
      <br />
      <UnEstimatedTasks />
      <br />
      <Chart tasks={tasks} />
    </>
  );
};
