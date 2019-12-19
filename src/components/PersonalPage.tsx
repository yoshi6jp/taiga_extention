import React, { useContext, useEffect } from "react";
import { Button, Alert, Navbar } from "reactstrap";
import { PersonalTasks } from "./PersonalTasks";
import { PersonalInfo } from "./PersonalInfo";
import { RootContext } from "../Provider";
import { Chart } from "./chart/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { ActionTypes } from "../actions";
import { UpdateButton } from "./UpdateButton";
import { SignInForm } from "./SignInForm";

export const PersonalPage: React.FC = () => {
  const {
    state: { user, user_tasks, url },
    dispatch
  } = useContext(RootContext);
  const { uid } = useParams();
  useEffect(() => {
    if (uid && url) {
      dispatch({ type: ActionTypes.FETCH_USER, payload: { uid } });
    }
    return () => {
      dispatch({ type: ActionTypes.RESET_USER });
    };
  }, [dispatch, uid, url]);

  return (
    <>
      <Navbar color="light" light>
        <Button tag={Link} to="/" className="mr-auto">
          <FontAwesomeIcon icon={faArrowCircleLeft} /> Go back
        </Button>
        <SignInForm />
        <UpdateButton />
      </Navbar>
      {user ? (
        <>
          <PersonalInfo />
          <br />
          <PersonalTasks />
          <br />
          <Chart tasks={user_tasks} />
        </>
      ) : (
        <Alert color="danger">This user does not exist.</Alert>
      )}
    </>
  );
};
