import React, { useContext } from "react";
import { UserTasks } from "./UserTasks";
import { UnEstimatedTasks } from "./UnEstimatedTasks";
import { NotAssignedTasks } from "./NotAssignedTasks";
import { Chart } from "./chart/Chart";
// import { Hero } from "./Hero";
import { RootContext } from "../Provider";

export const OverView: React.FC = () => {
  const {
    state: { tasks }
  } = useContext(RootContext);
  return (
    <>
      <UserTasks />
      <Chart tasks={tasks} />
      {/* <Hero /> */}
      <NotAssignedTasks />
      <br />
      <UnEstimatedTasks />
    </>
  );
};
