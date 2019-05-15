import React from "react";
import { Card, CardHeader } from "reactstrap";
import { IUser } from "../store";

import { AvatarSquare } from "./UserTasks";
export const PersonalInfo = ({ userInfo }: { userInfo: IUser }) => {
  return (
    <Card>
      <CardHeader>
        <AvatarSquare src={userInfo.photo} size="xlarge" />
        {userInfo.username} 's task
      </CardHeader>
    </Card>
  );
};
