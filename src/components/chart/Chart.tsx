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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLevelDownAlt,
  faLevelUpAlt
} from "@fortawesome/free-solid-svg-icons";

import { ITask } from "../../store";
import moment from "moment";
import _ from "lodash";
import { RootContext } from "../../Provider";
import { dayNameFromIdx } from "../DaysSelector";
import {
  Card,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { getSumCustomVal } from "../task/UserTasks";
import { BurnUpChart } from "./BurnUp";
interface IChartItem {
  label: string;
  ideal: number;
  actual?: number;
  add?: number;
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

const getTaskCreatedToday = (tasks: ITask[], date: string) =>
  tasks.filter(
    task =>
      moment(date)
        .local()
        .format("YYYY-MM-DD") ===
      moment(task.created_date)
        .local()
        .format("YYYY-MM-DD")
  );

const getTaskCreated = (tasks: ITask[], date: string) =>
  tasks.filter(
    task =>
      moment(date)
        .local()
        .endOf("days")
        .diff(moment(task.created_date)) > 0
  );
type ChartType = "Burn up" | "Burn down";
interface ChartTypeItemProps {
  type: ChartType;
}

const ChartTypeItem: React.FC<ChartTypeItemProps> = ({ type }) => {
  const icon = type === "Burn down" ? faLevelDownAlt : faLevelUpAlt;
  return (
    <span>
      {type}

      <FontAwesomeIcon className="fa-fw" icon={icon} />
    </span>
  );
};
interface ChartTypeDropdownItemProps extends ChartTypeItemProps {
  onSelect: (type: ChartType) => void;
}
const ChartTypeDropdownItem: React.FC<ChartTypeDropdownItemProps> = ({
  type,
  onSelect
}) => {
  const handleClick = useCallback(() => {
    onSelect(type);
  }, [onSelect, type]);
  return (
    <DropdownItem onClick={handleClick}>
      <ChartTypeItem type={type} />
    </DropdownItem>
  );
};
export const Chart = ({ tasks }: { tasks: ITask[] }) => {
  const [chartType, setChartType] = useState<ChartType>("Burn up");
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
          const actual =
            getSumCustomVal(custom_value_map, getTaskCreated(tasks, day), eid) -
            add -
            getSumCustomVal(custom_value_map, getTaskFinished(tasks, day), eid);
          return { label, ideal, actual, add };
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
  const handleSelect = useCallback((type: ChartType) => {
    setChartType(type);
  }, []);
  if (data.length === 0) {
    return null;
  } else {
    return (
      <Card className="mb-2">
        <CardHeader className="d-flex">
          <div className="mr-auto">Chart</div>
          <UncontrolledButtonDropdown>
            <DropdownToggle className="my-n1" size="sm" caret>
              <ChartTypeItem type={chartType} />
            </DropdownToggle>
            <DropdownMenu>
              <ChartTypeDropdownItem type="Burn up" onSelect={handleSelect} />
              <ChartTypeDropdownItem type="Burn down" onSelect={handleSelect} />
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </CardHeader>
        {chartType === "Burn down" ? (
          <ComposedChart data={data} width={800} height={400}>
            <YAxis />
            <XAxis dataKey="label" />
            <Tooltip formatter={formatter} />
            <Legend formatter={_.upperFirst} />
            <Bar dataKey="actual" fill="#8884d8" stackId="a" />
            <Bar dataKey="add" fill="#82ca9d" stackId="a" />
            <Line dataKey="ideal" />
          </ComposedChart>
        ) : (
          <BurnUpChart tasks={tasks} />
        )}
      </Card>
    );
  }
};
