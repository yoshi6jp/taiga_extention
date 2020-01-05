import React, { useContext, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootContext } from "../Provider";
import { ActionTypes } from "../actions";
import { commonActions } from "../features/common/commonSlice";
interface UpdateButtonProps {
  size?: "sm",
}
export const UpdateButton: React.FC<UpdateButtonProps> = ({ size }) => {
  const dispatch = useDispatch()
  const { dispatch: xdispatch } = useContext(RootContext);
  const updateData = useCallback(() => {
    xdispatch({ type: ActionTypes.UPDATE_DATA });
    dispatch(commonActions.updateData())
  }, [xdispatch, dispatch]);
  return (
    <Button onClick={updateData} size={size} className="mx-1">
      <FontAwesomeIcon icon={faSyncAlt} />
    </Button>
  );
};
