import React, { useContext, useMemo } from "react";
import cn from "classnames";
import { getSumCustomVal } from "../../components/task/UserTasks";
import { RootContext } from "../../Provider";
import { Progress } from "reactstrap";
import st from "./TaskTotalHours.module.css"
import { ITask } from "./taskSlice";
interface TaskTotalHoursProps {
  tasks: ITask[];
  totalHours: number;
  rejectVal: number;
}
export const TaskTotalHours: React.FC<TaskTotalHoursProps> = ({ tasks, totalHours, rejectVal }) => {
  const { state: { custom_eid, custom_value_map } } = useContext(RootContext)
  const sum = useMemo(() => getSumCustomVal(custom_value_map, tasks, Number(custom_eid)), [
    custom_eid, custom_value_map, tasks
  ])
  const total = sum - rejectVal;
  const max = totalHours * 1.5;
  const isOver = total > totalHours

  return (
    <Progress multi style={{ position: "relative" }}>
      <Progress bar value={total} max={max} color={isOver ? "danger" : "success"} >{total} / {totalHours}</Progress>
      <Progress className={cn(st.total, { [st.is_over]: isOver })}
        bar color={isOver ? "success" : "success"} value={totalHours} max={max} > {isOver ? `${total} / ${totalHours} ` : ""}</Progress>
    </Progress>
  )
}