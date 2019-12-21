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
import { getTaskCreated, getTaskFinished, getTaskCreatedToday } from "./Chart";
interface IChartItem {
  label: string;
  ideal: number;
  remaining?: number;
  add?: number;
}

export const BurnDownChart = ({ tasks }: { tasks: ITask[] }) => {
  const [data, setData] = useState<IChartItem[]>([]);
  const {
    state: { biz_days, custom_value_map, custom_eid }
  } = useContext(RootContext);
  useEffect(() => {
    const days_len = biz_days.length;
    const eid = Number(custom_eid);
    if (days_len > 0 && tasks.length > 0 && custom_eid) {
      const allTaskVal = getSumCustomVal(
        custom_value_map,
        getTaskCreated(tasks, biz_days[0]),
        eid
      );
      const data = biz_days.map((day, idx) => {
        const label = dayNameFromIdx(day, idx);
        const ideal = allTaskVal - (allTaskVal * idx) / (days_len - 1);
        if (
          moment()
            .local()
            .endOf("days")
            .diff(moment(day)) > 0
        ) {
          const add =
            idx === 0
              ? 0
              : getSumCustomVal(
                  custom_value_map,
                  getTaskCreatedToday(tasks, day),
                  eid
                );
          const remaining = Math.max(
            getSumCustomVal(custom_value_map, getTaskCreated(tasks, day), eid) -
              add -
              getSumCustomVal(
                custom_value_map,
                getTaskFinished(tasks, day),
                eid
              ),
            0
          );

          return { label, ideal, remaining, add };
        } else {
          return { label, ideal };
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
        <Bar dataKey="remaining" fill="#8884d8" stackId="a" />
        <Bar dataKey="add" fill="#82ca9d" stackId="a" />
        <Line dataKey="ideal" />
      </ComposedChart>
    );
  }
};
