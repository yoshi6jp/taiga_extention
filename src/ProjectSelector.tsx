import React, { useCallback, useEffect, useContext, useState } from "react";
import axios from "axios";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { RootContext, baseUrl } from "./Provider";
import { IProject } from "./store";
import { ActionTypes } from "./actions";
export const ProjectSelector = () => {
  const {
    state: { url, pid: statePid, projects },
    dispatch
    // setPid
  } = useContext(RootContext);
  const [items, setItems] = useState<IProject[]>([]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const pid = e.target.value;
      if (pid) {
        // setPid(pid);
        dispatch({ type: ActionTypes.SET_PID, payload: { pid } });
      }
    },
    [
      // dispatch
      //  setPid
    ]
  );
  // useEffect(() => {
  //   console.log("effect", url, dispatch);
  //   if (url) {
  //     (async () => {
  //       const { data: projects } = await axios.get(`${baseUrl(url)}/projects`);
  //       // setItems(items);
  //       dispatch({ type: ActionTypes.SET_PROJECTS, payload: { projects } });
  //     })();
  //   }
  // }, [url]);

  return (
    <InputGroup className="col">
      <InputGroupAddon addonType="prepend">Project</InputGroupAddon>
      <Input value={statePid} type="select" onChange={handleChange}>
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
