import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ICustomValueMap, IProject, IUser, ITask, ICustomAttr } from './store';
import { RootContext, baseUrl } from './Provider';
import { Table, Button } from 'reactstrap';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faMedal } from '@fortawesome/free-solid-svg-icons';
import styles from './UserTasks.module.css';
import moment from 'moment';

const getTasksByUser = (items: ITask[]) => _.groupBy(items, 'assigned_to');
export const parseCustomVal = (val: string) =>
  _.chain(val)
    .replace(/[^0-9.+,]/g, '')
    .replace(/[+]/g, ',')
    .split(',')
    .compact()
    .map(Number)
    .sum()
    .value();

export const getCustomVal = (
  custom_value_map: ICustomValueMap,
  task: ITask,
  id: number
) => {
  if (custom_value_map.has(task)) {
    return parseCustomVal(
      _.get(custom_value_map.get(task), `attributes_values.${id}`, '0')
    );
  } else {
    return 0;
  }
};
const getGrade = (e: any, r: any): [string | null, number] => {
  if (_.isNumber(e) && _.isNumber(r) && e > 0) {
    const diff = Math.abs(e - r) / e;
    if (diff <= 0.05) {
      return ['gold', 3];
    }
    if (diff <= 0.1) {
      return ['silver', 2];
    }
    if (diff < 0.2) {
      return ['bronze', 1];
    }
  }
  return [null, 0];
};
const Medal = ({ e, r }: { e: any; r: any }) => {
  const [grade, num] = getGrade(e, r);
  if (grade) {
    return (
      <>
        {_.times(num).map(i => (
          <FontAwesomeIcon key={i} className={styles[grade]} icon={faMedal} />
        ))}
      </>
    );
  } else {
    return null;
  }
};

const UserRow = ({
  item,
  sums,
  isPast
}: {
  item: IUser;
  sums: { [key: string]: { e: number; r: number } };
  isPast: boolean;
}) => {
  const e = _.get(sums, `${item.id}.e`);
  const r = _.get(sums, `${item.id}.r`);
  return (
    <tr key={item.id}>
      <td>{item.username}</td>
      <td className="text-right">{e}</td>
      <td className="text-right">{r}</td>
      {isPast ? (
        <td>
          <Medal e={e} r={r} />
        </td>
      ) : null}
    </tr>
  );
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
      custom_rid,
      biz_days
    },
    updateData
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
  if (!customAttrE || !customAttrR || biz_days.length <= 1) {
    return null;
  }
  const unassignedSum = _.get(taskSumByUser, 'null.e', 0);
  const isPast =
    moment().diff(
      moment(_.last(biz_days))
        .local()
        .endOf('days')
    ) > 0;
  return (
    <>
      <div className="text-right">
        <Button onClick={updateData}>
          <FontAwesomeIcon icon={faSyncAlt} />
        </Button>
      </div>
      <Table bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>{customAttrE.name}</th>
            <th>{customAttrR.name}</th>
            {isPast ? <th>Grade</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <UserRow
              key={item.id}
              isPast={isPast}
              item={item}
              sums={taskSumByUser}
            />
          ))}
          <tr key="null">
            <td>unassigned</td>
            <td className="text-right text-danger">{unassignedSum}</td>
            <td />
            {isPast ? <td /> : null}
          </tr>
        </tbody>
      </Table>
    </>
  );
};
