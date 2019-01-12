import React, { useContext, useState, useEffect } from 'react';
import {
  ComposedChart,
  Tooltip,
  Legend,
  Line,
  XAxis,
  YAxis,
  Bar
} from 'recharts';
import { ITask, ICustomValueMap } from './store';
import _ from 'lodash';
import moment from 'moment';
import { RootContext } from './Provider';
import { dayNameFromIdx } from './DaysSelector';
import { getCustomVal } from './UserTasks';
import { Card, CardHeader } from 'reactstrap';
interface IChartItem {
  label: string;
  estimate: number;
  result?: number;
  add?: number;
}

const getTaskFinished = (tasks: ITask[], date: string) =>
  tasks.filter(
    task =>
      task.finished_date
        ? moment(date)
            .local()
            .endOf('days')
            .diff(moment(task.finished_date)) > 0
        : false
  );

const getTaskCreatedToday = (tasks: ITask[], date: string) =>
  tasks.filter(
    task =>
      moment(date)
        .local()
        .format('YYYY-MM-DD') ===
      moment(task.created_date)
        .local()
        .format('YYYY-MM-DD')
  );

const getTaskCreated = (tasks: ITask[], date: string) =>
  tasks.filter(
    task =>
      moment(date)
        .endOf('days')
        .diff(moment(task.created_date)) > 0
  );

const getSumVal = (
  custom_value_map: ICustomValueMap,
  tasks: ITask[],
  custom_eid: string
) => {
  return _.chain(tasks)
    .map(task => getCustomVal(custom_value_map, task, Number(custom_eid)))
    .sum()
    .value();
};
export const Chart = () => {
  const [data, setData] = useState<IChartItem[]>([]);
  const {
    state: { tasks, biz_days, custom_value_map, custom_eid }
  } = useContext(RootContext);
  useEffect(
    () => {
      const days_len = biz_days.length;
      if (days_len > 0 && tasks.length > 0 && custom_eid) {
        const allTaskVal = getSumVal(
          custom_value_map,
          getTaskCreated(tasks, biz_days[0]),
          custom_eid
        );
        const data = biz_days.map((day, idx) => {
          const label = dayNameFromIdx(day, idx);
          const estimate = allTaskVal - (allTaskVal * idx) / (days_len - 1);
          if (
            moment()
              .local()
              .endOf('days')
              .diff(moment(day)) > 0
          ) {
            const result =
              allTaskVal -
              getSumVal(
                custom_value_map,
                getTaskFinished(tasks, day),
                custom_eid
              );
            const add =
              idx === 0
                ? 0
                : getSumVal(
                    custom_value_map,
                    getTaskCreatedToday(tasks, day),
                    custom_eid
                  );
            return { label, estimate, result, add };
          } else {
            return { label, estimate };
          }
        });
        setData(data);
      } else {
        setData([]);
      }
    },
    [tasks, biz_days, custom_eid, custom_value_map, setData]
  );
  if (data.length === 0) {
    return null;
  } else {
    return (
      <Card>
        <CardHeader>Burn down chart</CardHeader>
        <ComposedChart data={data} width={800} height={400}>
          <YAxis />
          <XAxis dataKey="label" />
          <Tooltip />
          <Bar dataKey="result" fill="#8884d8" stackId="a" />
          <Bar dataKey="add" fill="#82ca9d" stackId="a" />
          <Line dataKey="estimate" />
        </ComposedChart>
      </Card>
    );
  }
};
