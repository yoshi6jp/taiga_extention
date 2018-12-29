import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ICustomValueMap, IProject, IUser, ITask, ICustomAttr } from './store';
import { RootContext, baseUrl } from './Provider';
import { Table } from 'reactstrap';
import _ from 'lodash';

const getTasksByUser = (items: ITask[]) => _.groupBy(items, 'assigned_to');
export const getCustomVal = (
  custom_value_map: ICustomValueMap,
  task: ITask,
  id: number
) => {
  if (custom_value_map.has(task)) {
    return Number(
      _.get(custom_value_map.get(task), `attributes_values.${id}`, '0').replace(
        /[^0-9.]/g,
        ''
      )
    );
  } else {
    return 0;
  }
};

const getTaskSumByUser = (
  items: ITask[],
  custom_value_map: ICustomValueMap,
  custom_eid: string,
  custom_rid: string
) => {
  const eid = Number(custom_eid);
  const rid = Number(custom_rid);
  const tasksByUser = _.mapValues(getTasksByUser(items), tasks =>
    _.chain(tasks)
      .map(task => ({
        e: getCustomVal(custom_value_map, task, eid),
        r: getCustomVal(custom_value_map, task, rid)
      }))
      .reduce((result, val) => ({ e: result.e + val.e, r: result.r + val.r }), {
        e: 0,
        r: 0
      })
      .value()
  );
  return tasksByUser;
};
const getCustomAttr = (items: ICustomAttr[], id: number) =>
  items.find(item => item.id === id);
export const UserTasks = () => {
  const {
    state: {
      url,
      pid,
      tasks,
      custom_value_map,
      custom_attrs,
      custom_eid,
      custom_rid
    }
  } = useContext(RootContext);
  const [items, setItems] = useState<IUser[]>([]);
  useEffect(
    () => {
      if (url && pid) {
        (async () => {
          const {
            data: { members }
          } = await axios.get<IProject>(`${baseUrl(url)}/projects/${pid}`);
          setItems(members);
        })();
      }
    },
    [url, pid, setItems]
  );
  const taskSumByUser = getTaskSumByUser(
    tasks,
    custom_value_map,
    custom_eid,
    custom_rid
  );
  const customAttrE = getCustomAttr(custom_attrs, Number(custom_eid));
  const customAttrR = getCustomAttr(custom_attrs, Number(custom_rid));
  if (!customAttrE || !customAttrR) {
    return null;
  }
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>{customAttrE.name}</th>
          <th>{customAttrR.name}</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.username}</td>
            <td>{_.get(taskSumByUser, `${item.id}.e`)}</td>
            <td>{_.get(taskSumByUser, `${item.id}.r`)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
