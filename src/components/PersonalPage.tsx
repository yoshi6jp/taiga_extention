import React, { useContext, useEffect, useCallback } from "react";
import { Button, Alert, Navbar } from "reactstrap";
import { PersonalTasks } from "./PersonalTasks";
import { PersonalInfo } from "./PersonalInfo";
import { RootContext } from "../Provider";
import { Chart } from "./chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useParams, useHistory } from "react-router-dom";
import { ActionTypes } from "../actions";
import { UpdateButton } from "./UpdateButton";
import { SignInForm } from "./SignInForm";
import { useSettingSelector } from "../features/setting/settingSlice";

export const PersonalPage: React.FC = () => {
  const url = useSettingSelector.useUrl()
  const {
    state: { user, user_tasks },
    dispatch
  } = useContext(RootContext);
  const { uid, total_hours } = useParams();
  const totalHours = Number(total_hours || 0)
  const history = useHistory();
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
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
        <Button onClick={handleGoBack} className="mr-auto">
          <FontAwesomeIcon icon={faArrowCircleLeft} /> Go back
        </Button>
        <SignInForm />
        <UpdateButton />
      </Navbar>
      {user ? (
        <>
          <PersonalInfo />
          <br />
          {totalHours === 0 &&
            <>
              <Chart tasks={user_tasks} />
              <br />
            </>
          }
          <PersonalTasks totalHours={totalHours} />
        </>
      ) : (
          <Alert color="danger">This user does not exist.</Alert>
        )}
    </>
  );
};
