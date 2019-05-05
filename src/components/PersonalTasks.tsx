import React, { useContext, useState, useEffect } from "react";
import { RootContext } from "../Provider";
import { Table } from "reactstrap";
import { ITask, IUser } from "../store";
import { getCustomAttr, getCustomVal, Medal } from "./UserTasks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import styles from "./PersonalTasks.module.css";

const UserStoryLink = ({ url, item }: { url: string; item: ITask }) => {
  const {
    user_story_extra_info,
    project_extra_info: { slug }
  } = item;
  const usName = user_story_extra_info
    ? `#${user_story_extra_info.ref} ${user_story_extra_info.subject}`
    : undefined;
  const href = user_story_extra_info
    ? `${url}/project/${slug}/us/${user_story_extra_info.ref}`
    : "#";

  if (usName) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" title={usName}>
        <FontAwesomeIcon icon={faExternalLinkAlt} /> {usName}
      </a>
    );
  } else {
    return <>(Unassigned tasks)</>;
  }
};

const TaskLink = ({ url, item }: { url: string; item: ITask }) => {
  const taskName = `#${item.ref} ${item.subject}`;
  const href = `${url}/project/${item.project_extra_info.slug}/task/${
    item.ref
  }`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={taskName}>
      <FontAwesomeIcon icon={faExternalLinkAlt} /> {taskName}
    </a>
  );
};

export const PersonalTasks = ({ userInfo }: { userInfo: IUser }) => {
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
  useEffect(() => {
    const userTasks = tasks
      .filter(task => task.assigned_to === userInfo.id)
      .sort((a, b) => a.user_story - b.user_story);
    setItems(userTasks);
  }, [tasks, userInfo.id]);

  const customAttrE = getCustomAttr(custom_attrs, Number(custom_eid));
  const customAttrR = getCustomAttr(custom_attrs, Number(custom_rid));
  if (!customAttrE || !customAttrR || biz_days.length <= 1) {
    return null;
  }

  let totalE = 0;
  let totalR = 0;
  items.forEach(item => {
    totalE = totalE + getCustomVal(custom_value_map, item, customAttrE.id);
    totalR = totalR + getCustomVal(custom_value_map, item, customAttrR.id);
  });

  return (
    <Table bordered size="sm" className={styles.overflow}>
      <thead>
        <tr>
          <th>User story</th>
          <th>Task name</th>
          <th>Status</th>
          <th>{customAttrE.name}</th>
          <th>{customAttrR.name}</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {/* tasks */}
        {items.map(item => {
          const e = getCustomVal(custom_value_map, item, customAttrE.id);
          const r = getCustomVal(custom_value_map, item, customAttrR.id);
          return (
            <tr key={item.id}>
              <td className={item.is_closed ? "table-secondary" : undefined}>
                <UserStoryLink url={url} item={item} />
              </td>
              <td className={item.is_closed ? "table-secondary" : undefined}>
                <TaskLink url={url} item={item} />
              </td>
              <td className={item.is_closed ? "table-secondary" : undefined}>
                {item.status_extra_info.name}
              </td>
              <td className="text-right">{e}</td>
              <td
                className={classNames(
                  "text-right",
                  r > e ? "text-danger" : undefined
                )}
              >
                {r}
              </td>
              <td>
                <Medal e={e} r={r} />
              </td>
            </tr>
          );
        })}
        {/* total */}
        <tr>
          <td colSpan={3}>Total</td>
          <td className="text-right">{totalE}</td>
          <td
            className={classNames(
              "text-right",
              totalR > totalE ? "text-danger" : undefined
            )}
          >
            {totalR}
          </td>
          <td>
            <Medal e={totalE} r={totalR} />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
