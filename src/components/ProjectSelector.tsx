import React, { useCallback, useContext } from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { LinearLoader } from "./common/LinearLoader";
import { RootContext } from "../Provider";
import { ActionTypes } from "../actions";
import _ from "lodash";
import { useProjectSelector } from "../features/project/projectSlice";
export const ProjectSelector = () => {
  const projects = useProjectSelector.useList()
  const {
    state: { pid, },
    dispatch
  } = useContext(RootContext);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      if (id) {
        dispatch({ type: ActionTypes.SET_PID, payload: { pid: id } });
      }
    },
    [dispatch]
  );
  return (
    <InputGroup className="col">
      <InputGroupAddon addonType="prepend">Project</InputGroupAddon>
      {_.isEmpty(projects) ? (
        <LinearLoader />
      ) : (
          <Input value={pid} type="select" onChange={handleChange}>
            <option value=""> --- </option>
            {projects.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Input>
        )}
    </InputGroup>
  );
};
