import React, { useContext } from "react";
import { Card, CardHeader } from "reactstrap";
import { RootContext } from "../Provider";

import { AvatarSquare } from "./task/UserTasks";
export const PersonalInfo: React.FC = () => {
  const {
    state: { user }
  } = useContext(RootContext);
  return (
    <Card>
      {user && (
        <CardHeader>
          <AvatarSquare src={user.photo} size="xlarge" />
          {user.username} 's task
        </CardHeader>
      )}
    </Card>
  );
};
