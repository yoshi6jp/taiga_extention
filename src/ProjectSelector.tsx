import React, { useCallback, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Input, InputGroup } from 'reactstrap';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import { RootContext, baseUrl } from './Provider';
import { IUser } from './UserTasks';
export interface IProject {
  id: number;
  name: string;
  members: IUser[];
}
export const ProjectSelector = () => {
  const {
    state: { url, pid: statePid },
    setPid
  } = useContext(RootContext);
  const [items, setItems] = useState<IProject[]>([]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const pid = e.target.value;
      if (pid) {
        setPid(pid);
      }
    },
    [setPid]
  );
  useEffect(
    () => {
      if (url) {
        (async () => {
          const { data: items } = await axios.get(`${baseUrl(url)}/projects`);
          setItems(items);
        })();
      }
    },
    [url, setItems]
  );

  return (
    <InputGroup className="col">
      <InputGroupAddon addonType="prepend">Project</InputGroupAddon>
      <Input type="select" onChange={handleChange}>
        <option> --- </option>
        {items.map(item => (
          <option
            key={item.id}
            value={item.id}
            selected={String(item.id) === statePid}
          >
            {item.name}
          </option>
        ))}
      </Input>
    </InputGroup>
  );
};
