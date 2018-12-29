import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IProject } from './ProjectSelector';
import { ITask, ICustomValue, ICustomAttr } from './store';
import { RootContext, baseUrl } from './Provider';
import { Table } from 'reactstrap';
import _ from 'lodash';
export interface IUser {
  id: number;
  username: string;
  full_name: string;
  full_name_display: string;
  photo: string;
}
const getTasksByUser = (items: ITask[]) => _.groupBy(items, 'assigned_to');
const getCustomAttrVal = (val: ICustomValue | undefined, id: number) =>
  val && val.attributes_values ? Number(val.attributes_values[id]) || 0 : 0;
const getTaskSumByUser = (
  items: ITask[],
  custom_value_map: WeakMap<ITask, ICustomValue>,
  custom_eid: string,
  custom_rid: string
) => {
  const tasksByUser = _.chain(getTasksByUser(items))
    .mapValues(userTasks =>
      userTasks.map(task => custom_value_map.get(task)).reduce(
        (result, attr_vals) => ({
          e: result.e + getCustomAttrVal(attr_vals, Number(custom_eid)),
          r: result.r + getCustomAttrVal(attr_vals, Number(custom_rid))
        }),
        { e: 0, r: 0 }
      )
    )
    .value();
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
