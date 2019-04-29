import React, { useCallback, useEffect, useContext, useState } from "react";
import axios from "axios";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { RootContext, baseUrl } from "./Provider";
import { IMilestone, ITask } from "./store";
import _ from "lodash";

export const MilestoneSelector = () => {
  const {
    state: { url, pid, mid: stateMid, updated_time, reject_task_status_ids },
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
    [setMid]
  );
  useEffect(() => {
    if (url && pid) {
      (async () => {
        const { data: items } = await axios.get(`${baseUrl(url)}/milestones`, {
          params: { project: pid }
        });
        setItems(items);
        setMilestones(items);
      })();
    }
  }, [url, pid, setMilestones]);
  useEffect(() => {
    if (url && stateMid) {
      (async () => {
        const { data: items } = await axios.get<ITask[]>(
          `${baseUrl(url)}/tasks`,
          {
            headers: {
              "x-disable-pagination": true
            },
            params: {
              milestone: stateMid
            }
          }
        );
        const tasks = items.filter(
          item => !_.includes(reject_task_status_ids, String(item.status))
        );
        setTasks(tasks);
      })();
    }
  }, [url, stateMid, updated_time, reject_task_status_ids, setTasks]);

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
