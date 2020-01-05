import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboard
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { ITask } from "../../store";
import {
  Button,
  Card,
  CardHeader,
} from "reactstrap";
import { ChartTypeSelector, ChartType } from "../../features/chart/ChartTypeSelector";
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


type ChartSizeType = "lg" | "sm"
export interface BurnChartProps {
  tasks: ITask[]
  size?: ChartSizeType
}
export const chartSize = (size: ChartSizeType) => {
  if (size === "sm") {
    return {
      width: 250,
      height: 200
    }
  } else {
    return {
      width: 800,
      height: 400
    }
  }
}
export const Chart = ({ tasks }: { tasks: ITask[] }) => {
  const [chartType, setChartType] = useState<ChartType>("Burn up");
  const handleSelect = useCallback((type: ChartType) => {
    setChartType(type);
  }, [setChartType]);
  if (tasks.length === 0) {
    return null;
  } else {
    return (
      <Card className="mb-2">
        <CardHeader className="d-flex">
          <div className="mr-auto">
            <Button size="sm" tag={Link} to={"/board"} color="primary" className="mr-2" title="Board">
              <FontAwesomeIcon icon={faChalkboard} />
            </Button>
            Chart</div>
          <ChartTypeSelector onSelect={handleSelect} type={chartType} />
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
