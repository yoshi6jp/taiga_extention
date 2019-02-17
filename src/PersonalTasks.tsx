import React, { useContext, useState, useEffect } from "react";
import { RootContext } from "./Provider";
import { Card, CardHeader, ListGroup, Table } from "reactstrap";
import { ITask } from "./store";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import { getCustomAttr, getCustomVal } from "./UserTasks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const UserStoryLink = ({ url, item }: { url: string; item: ITask }) => {
  const href = `${url}/project/${item.project_extra_info.slug}/us/${
    item.user_story_extra_info.ref
  }`;
  return (
    <a href={href} target="_blank">
      <FontAwesomeIcon icon={faExternalLinkAlt} />{" "}
      {item.user_story_extra_info.subject}
    </a>
  );
};

const TaskLink = ({ url, item }: { url: string; item: ITask }) => {
  const href = `${url}/project/${item.project_extra_info.slug}/task/${
    item.ref
  }`;
  return (
    <a href={href} target="_blank">
      <FontAwesomeIcon icon={faExternalLinkAlt} /> {item.subject}
    </a>
  );
};

export const PersonalTasks = () => {
  const {
    state: {
      url,
      tasks,
      custom_attrs,
      custom_value_map,
      custom_eid,
      custom_rid,
      biz_days
    }
  } = useContext(RootContext);
  const [items, setItems] = useState<ITask[]>([]);
  const activeLen = biz_days.length - 1;
  useEffect(
    () => {
      setItems(tasks);
    },
    [tasks]
  );

  const customAttrE = getCustomAttr(custom_attrs, Number(custom_eid));
  const customAttrR = getCustomAttr(custom_attrs, Number(custom_rid));
  if (!customAttrE || !customAttrR || biz_days.length <= 1) {
    return null;
  }

  return (
    <Card>
      <CardHeader>Tasks</CardHeader>
      <Table bordered>
        <thead>
          <tr>
            <th>User story</th>
            <th>Task name</th>
            <th>Status</th>
            <th>{customAttrE.name}</th>
            <th>{customAttrR.name}</th>
          </tr>
        </thead>
        <tbody>
          {/* tasks */}
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <UserStoryLink url={url} item={item} />
              </td>
              <td>
                <TaskLink url={url} item={item} />
              </td>
              <td>{item.status_extra_info.name}</td>
              <td className="text-right">
                {getCustomVal(custom_value_map, item, customAttrE.id)}
              </td>
              <td className="text-right">
                {getCustomVal(custom_value_map, item, customAttrR.id)}
              </td>
            </tr>
          ))}
          {/* total */}
          <tr>
            <td colSpan={3}>Total</td>
            <td className="text-right">12</td>
            <td className="text-right">3</td>
          </tr>
        </tbody>
      </Table>
    </Card>
  );
};
