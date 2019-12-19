import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  ComposedChart,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  Bar,
  Legend,
  TooltipFormatter
} from "recharts";
import { ITask } from "../../store";
import moment from "moment";
import _ from "lodash";
import { RootContext } from "../../Provider";
import { dayNameFromIdx } from "../DaysSelector";
import { getSumCustomVal } from "../task/UserTasks";
interface IChartItem {
  label: string;
  ideal: number;
  completed?: number;
  total: number;
}

const getTaskFinished = (tasks: ITask[], date: string) =>
  tasks.filter(task =>
    task.finished_date
      ? moment(date)
          .local()
          .endOf("days")
          .diff(moment(task.finished_date)) > 0
      : false
  );

const getTaskCreated = (tasks: ITask[], date: string) =>
  tasks.filter(
    task =>
      moment(date)
        .local()
        .endOf("days")
        .diff(moment(task.created_date)) > 0
  );
export const BurnUpChart = ({ tasks }: { tasks: ITask[] }) => {
  const [data, setData] = useState<IChartItem[]>([]);
  const {
    state: { biz_days, custom_value_map, custom_eid }
  } = useContext(RootContext);
  useEffect(() => {
    const days_len = biz_days.length;
    const eid = Number(custom_eid);
    if (days_len > 0 && tasks.length > 0 && custom_eid) {
      const allTaskVal = getSumCustomVal(custom_value_map, tasks, eid);
      const data = biz_days.map((day, idx) => {
        const label = dayNameFromIdx(day, idx);
        const ideal = (allTaskVal * idx) / (days_len - 1);
        const total = getSumCustomVal(
          custom_value_map,
          getTaskCreated(tasks, day),
          eid
        );

        if (
          moment()
            .local()
            .endOf("days")
            .diff(moment(day)) > 0
        ) {
          const completed = getSumCustomVal(
            custom_value_map,
            getTaskFinished(tasks, day),
            eid
          );
          return { label, ideal, completed, total };
        } else {
          return { label, ideal, total };
        }
      });
      setData(data);
    } else {
      setData([]);
    }
  }, [tasks, biz_days, custom_eid, custom_value_map, setData]);
  const formatter: TooltipFormatter = useCallback(
    (value, name) => [Number(value).toFixed(1), _.upperFirst(name)],
    []
  );
  if (data.length === 0) {
    return null;
  } else {
    return (
      <ComposedChart data={data} width={800} height={400}>
        <YAxis />
        <XAxis dataKey="label" />
        <Tooltip formatter={formatter} />
        <Legend formatter={_.upperFirst} />
        <Bar dataKey="completed" fill="#28a745" />
        <Line dataKey="ideal" stroke="#17a2b8" strokeDasharray="5 5" />
        <Line dataKey="total" stroke="#dc3545" />
      </ComposedChart>
    );
  }
};
