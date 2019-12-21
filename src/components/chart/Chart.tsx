import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLevelDownAlt,
  faLevelUpAlt
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { ITask } from "../../store";
import {
  Card,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { BurnUpChart } from "./BurnUp";
import { BurnDownChart } from "./BurnDown";
export const getTaskFinished = (tasks: ITask[], date: string) =>
  tasks.filter(task =>
    task.finished_date
      ? moment(date)
          .local()
          .endOf("days")
          .diff(moment(task.finished_date)) > 0
      : false
  );

export const getTaskCreatedToday = (tasks: ITask[], date: string) =>
  tasks.filter(
    task =>
      moment(date)
        .local()
        .format("YYYY-MM-DD") ===
      moment(task.created_date)
        .local()
        .format("YYYY-MM-DD")
  );

export const getTaskCreated = (tasks: ITask[], date: string) =>
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
  const handleSelect = useCallback((type: ChartType) => {
    setChartType(type);
  }, []);
  if (tasks.length === 0) {
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
          <BurnDownChart tasks={tasks} />
        ) : (
          <BurnUpChart tasks={tasks} />
        )}
      </Card>
    );
  }
};
