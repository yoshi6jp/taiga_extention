import React, { useCallback, useEffect, useContext, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { RootContext, baseUrl } from "./Provider";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  Input,
  FormGroup,
  Label
} from "reactstrap";
import { ITaskStatus } from "./store";
const StatusItem = ({ item }: { item: ITaskStatus }) => {
  const {
    state: { reject_task_status_ids },
    toggeRejectTaskStatus
  } = useContext(RootContext);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      toggeRejectTaskStatus(String(id), !e.target.checked);
    },
    [toggeRejectTaskStatus]
  );
  return (
    <FormGroup check inline>
      <Label check>
        <Input
          onChange={handleChange}
          type="checkbox"
          value={item.id}
          defaultChecked={!_.includes(reject_task_status_ids, String(item.id))}
        />
        {item.name}
      </Label>
    </FormGroup>
  );
};
export const TaskStatusSelector = () => {
  const {
    state: { url, pid },
    setTaskStatus
  } = useContext(RootContext);
  const [items, setItems] = useState<ITaskStatus[]>([]);
  useEffect(() => {
    if (url && pid) {
      (async () => {
        const { data: items } = await axios.get(
          `${baseUrl(url)}/task-statuses`,
          {
            params: { project: pid }
          }
        );
        setItems(items);
        setTaskStatus(items);
      })();
    }
  }, [url, pid]);
  if (items.length === 0) {
    return null;
  }
  return (
    <Card>
      <CardHeader>Task status</CardHeader>
      <CardBody>
        {items.map(item => (
          <StatusItem key={item.id} item={item} />
        ))}
      </CardBody>
    </Card>
  );
};
