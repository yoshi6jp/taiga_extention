import * as React from "react";
import axios from "axios";
import { RouteComponentProps } from "react-router";
import { Button, Alert } from "reactstrap";
import { PersonalTasks } from "./PersonalTasks";
import { PersonalInfo } from "./PersonalInfo";
import { useContext, useEffect, useState } from "react";
import { RootContext, baseUrl } from "./Provider";
import { IUser } from "./store";

export const PersonalPage = (props: RouteComponentProps<{ uid: string }>) => {
  const {
    state: { url }
  } = useContext(RootContext);
  const [userInfo, setUserInfo] = useState<IUser | undefined>(undefined);
  useEffect(
    () => {
      if (url) {
        (async () => {
          const { data } = await axios.get<IUser>(
            `${baseUrl(url)}/users/${props.match.params.uid}`
          );
          setUserInfo(data);
        })();
      }
    },
    [url, setUserInfo]
  );
  const goBack = () => {
    props.history.goBack();
  };

  return (
    <>
      <Button onClick={goBack}>Go back</Button>
      {userInfo ? (
        <>
          <PersonalInfo userInfo={userInfo} />
          <PersonalTasks userInfo={userInfo} />
        </>
      ) : (
        <Alert color="danger">This user does not exist.</Alert>
      )}
    </>
  );
};
