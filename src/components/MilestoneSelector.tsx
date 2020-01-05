import React, { useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import _ from "lodash";
import { RootContext } from "../Provider";
import { ActionTypes } from "../actions";
import { LinearLoader } from "./common/LinearLoader";
import { milestoneActions, useMilestoneSelector } from "../features/milestone/milestoneSlice";

export const MilestoneSelector = () => {
  const dispatch = useDispatch()
  const mid = useMilestoneSelector.useMid()
  const {
    state: { milestones },
    dispatch: xdispatch
  } = useContext(RootContext);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      if (id) {
        xdispatch({ type: ActionTypes.SET_MID, payload: { mid: id } });
        dispatch(milestoneActions.setMid(id))
      }
    },
    [xdispatch, dispatch]
  );

  return (
    <InputGroup className="col">
      <InputGroupAddon addonType="prepend">Sprint</InputGroupAddon>
      {_.isEmpty(milestones) ? (
        <LinearLoader />
      ) : (
          <Input type="select" value={mid} onChange={handleChange}>
            <option value=""> --- </option>
            {milestones.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Input>
        )}
    </InputGroup>
  );
};
