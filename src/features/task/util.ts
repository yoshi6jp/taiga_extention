import _ from "lodash";
import { ITask, ICustomValueMap } from "./taskSlice";
export const getTasksByUser = (items: ITask[]) =>
  _.chain(items)
    .reject(item => !item.assigned_to)
    .groupBy("assigned_to").value();
export const parseCustomVal = (val: string) =>
  _.chain(val)
    .replace(/[^0-9.+,]/g, "")
    .replace(/[+]/g, ",")
    .split(",")
    .compact()
    .map(Number)
    .sum()
    .value();
export const getSumCustomVal = (
  custom_value_map: ICustomValueMap,
  tasks: ITask[],
  id: number
) =>
  _.chain(tasks)
    .map(task => getCustomVal(custom_value_map, task, id))
    .sum()
    .value();
export const getCustomVal = (
  custom_value_map: ICustomValueMap,
  task: ITask,
  id: number
) => {
  if (custom_value_map.has(task)) {
    return parseCustomVal(
      _.get(custom_value_map.get(task), `attributes_values.${id}`, "0")
    );
  } else {
    return 0;
  }
};
export const getSumCustomValClosed = (
  custom_value_map: ICustomValueMap,
  tasks: ITask[],
  id: number
) =>
  getSumCustomVal(
    custom_value_map,
    tasks.filter(item => item.is_closed),
    id
  );