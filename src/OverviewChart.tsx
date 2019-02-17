import React, { useContext, useState, useEffect } from "react";
import { RootContext } from "./Provider";
import { Chart } from "./Chart";

export const OverviewChart = () => {
  const {
    state: { tasks }
  } = useContext(RootContext);
  return <Chart tasks={tasks} />;
};
