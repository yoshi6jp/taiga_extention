import React, { useContext, useMemo } from "react";
import _ from "lodash";
import { RootContext } from "../Provider";
import { UserStoryWithTaskUser, convToTasksByUserStory } from "./UserStory";
import { Card, CardHeader, CardBody } from "reactstrap";
export const NotAssignedTasks: React.FC = () => {
  const {
    state: { tasks }
  } = useContext(RootContext);
  const items = useMemo(() => _.filter(tasks, { assigned_to: null }), [tasks]);
  const userStories = useMemo(() => convToTasksByUserStory(items), [items]);
  if (items.length === 0) {
    return null;
  } else {
    return (
      <Card>
        <CardHeader className="alert-danger">Not assigned tasks</CardHeader>
        <CardBody>
          {userStories.map(item => (
            <UserStoryWithTaskUser item={item} key={item.user_story} />
          ))}
        </CardBody>
      </Card>
    );
  }
};
