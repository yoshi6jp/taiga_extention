import React from "react";
import { Card, CardHeader } from "reactstrap";
import { IUser } from "./store";

import styles from "./PersonalInfo.module.css";

export const PersonalInfo = ({ userInfo }: { userInfo: IUser }) => {
  const imgSrc = userInfo.photo || `http://i.pravatar.cc/80?u=${Math.random()}`;
  return (
    <Card>
      <CardHeader>
        <img className={styles.avator} src={imgSrc} />
        {` ${userInfo.username}'s tasks`}
      </CardHeader>
    </Card>
  );
};
