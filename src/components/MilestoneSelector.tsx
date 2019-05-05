import React, { useCallback, useContext } from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { RootContext } from "../Provider";
import { ActionTypes } from "../actions";

export const MilestoneSelector = () => {
  const {
    state: { milestones, mid },
    dispatch
  } = useContext(RootContext);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      if (id) {
        dispatch({ type: ActionTypes.SET_MID, payload: { mid: id } });
      }
    },
    [dispatch]
  );

  return (
    <InputGroup className="col">
      <InputGroupAddon addonType="prepend">Sprint</InputGroupAddon>
      <Input type="select" value={mid} onChange={handleChange}>
        <option value=""> --- </option>
        {milestones.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Input>
    </InputGroup>
  );
};
