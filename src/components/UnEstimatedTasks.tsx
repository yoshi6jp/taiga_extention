import React, { useContext, useMemo } from "react";
import { RootContext } from "../Provider";
import { Card, CardHeader, CardBody } from "reactstrap";
import { getCustomVal, getCustomValVersion } from "./task/UserTasks";
import { UserStoryWithEstimate, convToTasksByUserStory } from "./UserStory";
export const UnEstimatedTasks = () => {
  const {
    state: { tasks, custom_value_map, custom_eid }
  } = useContext(RootContext);
  const eid = useMemo(() => Number(custom_eid), [custom_eid]);
  const items = useMemo(
    () =>
      eid
        ? tasks.filter(
            task =>
              getCustomValVersion(custom_value_map, task) &&
              getCustomVal(custom_value_map, task, eid) === 0
          )
        : [],
    [custom_value_map, eid, tasks]
  );
  const userStories = useMemo(() => convToTasksByUserStory(items), [items]);
  if (items.length === 0) {
    return null;
  } else {
    return (
      <Card>
        <CardHeader className="alert-danger">Un estimated tasks</CardHeader>
        <CardBody>
          {userStories.map(item => (
            <UserStoryWithEstimate item={item} key={item.user_story} />
          ))}
        </CardBody>
      </Card>
    );
  }
};
