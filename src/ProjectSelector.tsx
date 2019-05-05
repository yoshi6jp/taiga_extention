import React, { useCallback, useContext } from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { RootContext } from "./Provider";
import { ActionTypes } from "./actions";
export const ProjectSelector = () => {
  const {
    state: { pid, projects },
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
      <Input value={pid} type="select" onChange={handleChange}>
        <option value=""> --- </option>
        {projects.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Input>
    </InputGroup>
  );
};
