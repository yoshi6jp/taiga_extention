import React, { useContext, useCallback } from "react";
import { Button } from "reactstrap";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootContext } from "../Provider";
import { ActionTypes } from "../actions";
export const UpdateButton: React.FC = () => {
  const { dispatch } = useContext(RootContext);
  const updateData = useCallback(() => {
    dispatch({ type: ActionTypes.UPDATE_DATA });
  }, [dispatch]);
  return (
    <Button onClick={updateData}>
      <FontAwesomeIcon icon={faSyncAlt} />
    </Button>
  );
};
