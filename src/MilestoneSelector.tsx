import React, { useCallback, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Input, InputGroup } from 'reactstrap';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import { RootContext, baseUrl } from './Provider';
import { IMilestone } from './store';

export const MilestoneSelector = () => {
  const {
    state: { url, pid, mid: stateMid },
    setMid,
    setMilestones,
    setTasks
  } = useContext(RootContext);
  const [items, setItems] = useState<IMilestone[]>([]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      if (id) {
        setMid(id);
      }
    },
    [setMid, items]
  );
  useEffect(
    () => {
      if (url && pid) {
        (async () => {
          const { data: items } = await axios.get(
            `${baseUrl(url)}/milestones`,
            { params: { project: pid } }
          );
          setItems(items);
          setMilestones(items);
        })();
      }
    },
    [url, pid, setItems, setMilestones]
  );
  useEffect(
    () => {
      if (url && stateMid) {
        (async () => {
          const { data: items } = await axios.get(`${baseUrl(url)}/tasks`, {
            headers: {
              'x-disable-pagination': true
            },
            params: {
              milestone: stateMid
            }
          });
          setTasks(items);
        })();
      }
    },
    [url, stateMid, setTasks]
  );

  return (
    <InputGroup className="col">
      <InputGroupAddon addonType="prepend">Sprint</InputGroupAddon>
      <Input type="select" value={stateMid} onChange={handleChange}>
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
