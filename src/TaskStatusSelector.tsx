import React, { useCallback, useContext } from "react";
import _ from "lodash";
import { RootContext } from "./Provider";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  FormGroup,
  Label
} from "reactstrap";
import { ITaskStatus } from "./store";
import { ActionTypes } from "./actions";
const StatusItem = ({ item }: { item: ITaskStatus }) => {
  const {
    state: { reject_task_status_ids },
    dispatch
  } = useContext(RootContext);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const reject_task_status_id = e.target.value;
      if (e.target.checked) {
        dispatch({
          type: ActionTypes.REMOVE_REJECT_TASK_STATUS_ID,
          payload: { reject_task_status_id }
        });
      } else {
        dispatch({
          type: ActionTypes.ADD_REJECT_TASK_STATUS_ID,
          payload: { reject_task_status_id }
        });
      }
    },
    [dispatch]
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
    state: { task_statuses }
  } = useContext(RootContext);
  if (task_statuses.length === 0) {
    return null;
  }
  return (
    <Card>
      <CardHeader>Task status</CardHeader>
      <CardBody>
        {task_statuses.map(item => (
          <StatusItem key={item.id} item={item} />
        ))}
      </CardBody>
    </Card>
  );
};
