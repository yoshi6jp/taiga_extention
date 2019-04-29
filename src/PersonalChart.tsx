import React, { useContext, useState, useEffect } from "react";
import { ITask, IUser } from "./store";
import { RootContext } from "./Provider";
import { Chart } from "./Chart";

export const PersonalChart = ({ userInfo }: { userInfo: IUser }) => {
  const [userTasks, setUserTasks] = useState<ITask[]>([]);
  const {
    state: { tasks }
  } = useContext(RootContext);
  useEffect(() => {
    const userTasks = tasks
      .filter(task => task.assigned_to === userInfo.id)
      .sort((a, b) => a.user_story - b.user_story);
    setUserTasks(userTasks);
  }, [tasks, userInfo.id]);

  return <Chart tasks={userTasks} />;
};
