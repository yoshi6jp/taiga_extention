import * as React from "react";
import axios from "axios";
import { RouteComponentProps } from "react-router";
import { Button, Alert, Navbar } from "reactstrap";
import { PersonalTasks } from "./PersonalTasks";
import { PersonalInfo } from "./PersonalInfo";
import { useContext, useEffect, useState } from "react";
import { RootContext, baseUrl } from "./Provider";
import { IUser } from "./store";
import { PersonalChart } from "./PersonalChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faArrowCircleLeft
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const PersonalPage = (props: RouteComponentProps<{ uid: string }>) => {
  const {
    state: { url },
    updateData
  } = useContext(RootContext);
  const [userInfo, setUserInfo] = useState<IUser | undefined>(undefined);
  useEffect(() => {
    if (url) {
      (async () => {
        const { data } = await axios.get<IUser>(
          `${baseUrl(url)}/users/${props.match.params.uid}`
        );
        setUserInfo(data);
      })();
    }
  }, [url, setUserInfo, props.match.params.uid]);

  return (
    <>
      <Navbar color="light" light>
        <Button tag={Link} to="/">
          <FontAwesomeIcon icon={faArrowCircleLeft} /> Go back
        </Button>
        <Button onClick={updateData}>
          <FontAwesomeIcon icon={faSyncAlt} />
        </Button>
      </Navbar>
      {userInfo ? (
        <>
          <PersonalInfo userInfo={userInfo} />
          <PersonalTasks userInfo={userInfo} />
          <PersonalChart userInfo={userInfo} />
        </>
      ) : (
        <Alert color="danger">This user does not exist.</Alert>
      )}
    </>
  );
};
