import React, { useContext, useState, useEffect } from "react";
import { RootContext } from "../Provider";
import { ITask } from "../store";
import { ListGroup, ListGroupItem, Card, CardHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { getCustomVal } from "./UserTasks";
const TaskItem = ({ url, item }: { item: ITask; url: string }) => {
  const {
    project_extra_info: { slug }
  } = item;
  const href = `${url}/project/${slug}/task/${item.ref}`;
  return (
    <ListGroupItem tag="a" target="_blank" href={href}>
      <FontAwesomeIcon icon={faExternalLinkAlt} /> {item.subject}
    </ListGroupItem>
  );
};
export const UnEstimatedTasks = () => {
  const {
    state: { url, tasks, custom_value_map, custom_eid }
  } = useContext(RootContext);
  const [items, setItems] = useState<ITask[]>([]);
  useEffect(() => {
    if (tasks.length > 0 && custom_eid) {
      const eid = Number(custom_eid);
      const items = tasks.filter(
        task => getCustomVal(custom_value_map, task, eid) === 0
      );
      if (tasks.length > items.length) {
        setItems(items);
      }
    }
  }, [tasks, custom_value_map, custom_eid]);
  if (items.length === 0) {
    return null;
  } else {
    return (
      <Card>
        <CardHeader>Un estimated tasks</CardHeader>
        <ListGroup>
          {items.map(item => (
            <TaskItem url={url} key={item.id} item={item} />
          ))}
        </ListGroup>
      </Card>
    );
  }
};
