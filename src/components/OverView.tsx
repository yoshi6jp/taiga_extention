import React, { useContext } from "react";
import { UserTasks } from "./task/UserTasks";
import { UnEstimatedTasks } from "./UnEstimatedTasks";
import { NotAssignedTasks } from "./NotAssignedTasks";
import { Chart } from "./chart";
// import { Hero } from "./Hero";
import { RootContext } from "../Provider";

export const OverView: React.FC = () => {
  const {
    state: { tasks }
  } = useContext(RootContext);
  return (
    <>
      <Chart tasks={tasks} />
      <UserTasks />
      {/* <Hero /> */}
      <NotAssignedTasks />
      <br />
      <UnEstimatedTasks />
    </>
  );
};
