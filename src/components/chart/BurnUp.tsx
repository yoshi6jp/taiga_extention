import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  ComposedChart,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  Bar,
  Legend,
  TooltipFormatter,
} from "recharts";
import moment from "moment";
import _ from "lodash";
import { RootContext } from "../../Provider";
import { dayNameFromIdx } from "../DaysSelector";
import { getSumCustomVal } from "../task/UserTasks";
import { getTaskCreated, getTaskFinished, BurnChartProps, chartSize } from "./Chart";
interface IChartItem {
  label: string;
  ideal: number;
  completed?: number;
  actual?: number;
  total: number;
  "in progress"?: number;
}

export const BurnUpChart: React.FC<BurnChartProps> = ({ tasks, size = "lg" }) => {
  const [data, setData] = useState<IChartItem[]>([]);
  const {
    state: { biz_days, custom_value_map, custom_eid, custom_rid }
  } = useContext(RootContext);
  const { width, height } = chartSize(size)
  const actualNow = useMemo(() => getSumCustomVal(custom_value_map, tasks, Number(custom_rid)), [
    custom_value_map, tasks, custom_rid
  ])
  useEffect(() => {
    const days_len = biz_days.length;
    const eid = Number(custom_eid);
    const rid = Number(custom_rid);
    if (days_len > 0 && tasks.length > 0 && custom_eid && custom_rid) {
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
          const actual = getSumCustomVal(
            custom_value_map,
            getTaskFinished(tasks, day),
            rid
          );
          if (
            moment()
              .local()
              .startOf("days")
              .diff(moment(day)) === 0
          ) {
            const inProgress = actualNow - actual;
            return { label, ideal, completed, actual, total, "in progress": inProgress };
          } else {
            return { label, ideal, completed, actual, total };
          }
        } else {
          return { label, ideal, total };
        }
      });
      setData(data);
    } else {
      setData([]);
    }
  }, [tasks, biz_days, custom_eid, custom_rid, custom_value_map, setData, actualNow]);
  const formatter: TooltipFormatter = useCallback(
    (value, name) => [Number(value).toFixed(1), _.upperFirst(name)],
    []
  );
  if (data.length === 0) {
    return null;
  } else {
    return (
      <ComposedChart data={data} width={width} height={height}>
        <YAxis />
        <XAxis dataKey="label" />
        <Tooltip formatter={formatter} />
        {size === "lg" &&
          <Legend formatter={_.upperFirst} />
        }
        <Bar dataKey="completed" fill="#28a745" />
        <Bar dataKey="actual" fill="#17a2b8" stackId="a" />
        <Bar dataKey="in progress" fill="#ffc107" stackId="a" />
        <Line dataKey="ideal" stroke="#007bff" strokeDasharray="5 5" />
        <Line dataKey="total" stroke="#dc3545" />
      </ComposedChart>
    );
  }
};
