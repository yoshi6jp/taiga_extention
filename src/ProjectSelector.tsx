import React, { useCallback, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { RootContext, baseUrl } from './Provider';
import { IProject } from './store';
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
      <Input value={statePid} type="select" onChange={handleChange}>
        <option value=""> --- </option>
        {items.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Input>
    </InputGroup>
  );
};
