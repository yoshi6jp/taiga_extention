import React, { useContext, useEffect } from "react";
import { Button, Alert, Navbar } from "reactstrap";
import { PersonalTasks } from "./PersonalTasks";
import { PersonalInfo } from "./PersonalInfo";
import { RootContext } from "../Provider";
import { Chart } from "./Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ActionTypes } from "../actions";
import { UpdateButton } from "./UpdateButton";
import useRouter from "use-react-router";
import { SignInForm } from "./SignInForm";

export const PersonalPage: React.FC = () => {
  const {
    state: { user, user_tasks },
    dispatch
  } = useContext(RootContext);
  const {
    match: {
      params: { uid }
    }
  } = useRouter();
  useEffect(() => {
    if (uid) {
      dispatch({ type: ActionTypes.FETCH_USER, payload: { uid } });
    }
    return () => {
      dispatch({ type: ActionTypes.RESET_USER });
    };
  }, [dispatch, uid]);

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
