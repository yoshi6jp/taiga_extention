import {
  IProject,
  IMilestone,
  ICustomAttr,
  ITask,
  ICustomValueMap,
  ITaskStatus
} from "./store";

export enum ActionTypes {
  SET_URL = "SET_URL",
  FETCH_PROJECTS = "FETCH_PROJECTS",
  SET_PROJECTS = "SET_PROJECTS",
  SET_PID = "SET_PID",
  FETCH_MILESTONES = "FETCH_MILESTONES",
  SET_MID = "SET_MID",
  SET_MILESTONES = "SET_MILESTONES",
  SET_CUSTOM_EID = "SET_CUSTOM_EID",
  SET_CUSTOM_RID = "SET_CUSTOM_RID",
  FETCH_CUSTOM_ATTRS = "FETCH_CUSTOM_ATTRS",
  SET_CUSTOM_ATTRS = "SET_CUSTOM_ATTRS",
  SET_BIZ_DAYS = "SET_BIZ_DAYS",
  ADD_BIZ_DAY = "ADD_BIZ_DAY",
  REMOVE_BIZ_DAY = "REMOVE_BIZ_DAY",
  FETCH_TASKS = "FETCH_TASKS",
  SET_TASKS = "SET_TASKS",
  FETCH_TASK_STATUSES = "FETCH_TASK_STATUSES",
  SET_TASK_STATUSES = "SET_TASK_STATUSES",
  FETCH_CUSTOM_VALUE_MAP = "FETCH_CUSTOM_VALUE_MAP",
  SET_CUSTOM_VALUE_MAP = "SET_CUSTOM_VALUE_MAP",
  ADD_REJECT_TASK_STATUS_ID = "ADD_REJECT_TASK_STATUS",
  REMOVE_REJECT_TASK_STATUS_ID = "REMOVE_REJECT_TASK_STATUS",
  OPEN_CONTROLLER = "OPEN_CONTROLLER",
  CLOSE_CONTROLLER = "CLOSE_CONTROLLER",
  UPDATE_DATA = "UPDATE_DATA"
}

export interface IAction {
  type: ActionTypes;
  payload?: any;
  meta?: { [key: string]: any };
}

export interface SET_URL extends IAction {
  type: ActionTypes.SET_URL;
  payload: { url: string };
}
export interface FETCH_PROJECTS extends IAction {
  type: ActionTypes.FETCH_PROJECTS;
}
export interface SET_PROJECTS extends IAction {
  type: ActionTypes.SET_PROJECTS;
  payload: { projects: IProject[] };
}

export interface SET_PID extends IAction {
  type: ActionTypes.SET_PID;
  payload: { pid: string };
}

export interface FETCH_MILESTONES extends IAction {
  type: ActionTypes.FETCH_MILESTONES;
  payload: { project: string };
}
export interface SET_MILESTONES extends IAction {
  type: ActionTypes.SET_MILESTONES;
  payload: { milestones: IMilestone[] };
}

export interface SET_MID extends IAction {
  type: ActionTypes.SET_MID;
  payload: { mid: string };
}

export interface SET_CUSTOM_EID extends IAction {
  type: ActionTypes.SET_CUSTOM_EID;
  payload: { custom_eid: string };
}

export interface SET_CUSTOM_RID extends IAction {
  type: ActionTypes.SET_CUSTOM_RID;
  payload: { custom_rid: string };
}

export interface FETCH_CUSTOM_ATTRS extends IAction {
  type: ActionTypes.FETCH_CUSTOM_ATTRS;
  payload: { project: string };
}
export interface SET_CUSTOM_ATTRS extends IAction {
  type: ActionTypes.SET_CUSTOM_ATTRS;
  payload: { custom_attrs: ICustomAttr[] };
}

export interface SET_BIZ_DAYS extends IAction {
  type: ActionTypes.SET_BIZ_DAYS;
  payload: { biz_days: string[] };
}

export interface ADD_BIZ_DAY extends IAction {
  type: ActionTypes.ADD_BIZ_DAY;
  payload: { biz_day: string };
}

export interface REMOVE_BIZ_DAY extends IAction {
  type: ActionTypes.REMOVE_BIZ_DAY;
  payload: { biz_day: string };
}

export interface FETCH_TASKS extends IAction {
  type: ActionTypes.FETCH_TASKS;
  payload: { milestone: string; reject_task_status_ids: string[] };
}
export interface SET_TASKS extends IAction {
  type: ActionTypes.SET_TASKS;
  payload: { tasks: ITask[] };
}
export interface FETCH_CUSTOM_VALUE_MAP extends IAction {
  type: ActionTypes.FETCH_CUSTOM_VALUE_MAP;
  payload: { tasks: ITask[] };
}
export interface SET_CUSTOM_VALUE_MAP extends IAction {
  type: ActionTypes.SET_CUSTOM_VALUE_MAP;
  payload: { custom_value_map: ICustomValueMap };
}

export interface FETCH_TASK_STATUSES extends IAction {
  type: ActionTypes.FETCH_TASK_STATUSES;
  payload: { project: string };
}
export interface SET_TASK_STATUSES extends IAction {
  type: ActionTypes.SET_TASK_STATUSES;
  payload: { task_statuses: ITaskStatus[] };
}
export interface ADD_REJECT_TASK_STATUS_ID extends IAction {
  type: ActionTypes.ADD_REJECT_TASK_STATUS_ID;
  payload: { reject_task_status_id: string };
}

export interface REMOVE_REJECT_TASK_STATUS_ID extends IAction {
  type: ActionTypes.REMOVE_REJECT_TASK_STATUS_ID;
  payload: { reject_task_status_id: string };
}

export interface OPEN_CONTROLLER extends IAction {
  type: ActionTypes.OPEN_CONTROLLER;
}

export interface CLOSE_CONTROLLER extends IAction {
  type: ActionTypes.CLOSE_CONTROLLER;
}

export interface UPDATE_DATA extends IAction {
  type: ActionTypes.UPDATE_DATA;
}

export type Actions =
  | SET_URL
  | FETCH_PROJECTS
  | SET_PROJECTS
  | SET_PID
  | FETCH_MILESTONES
  | SET_MILESTONES
  | SET_MID
  | SET_CUSTOM_EID
  | SET_CUSTOM_RID
  | FETCH_CUSTOM_ATTRS
  | SET_CUSTOM_ATTRS
  | SET_BIZ_DAYS
  | SET_BIZ_DAYS
  | ADD_BIZ_DAY
  | REMOVE_BIZ_DAY
  | FETCH_TASKS
  | SET_TASKS
  | FETCH_CUSTOM_VALUE_MAP
  | SET_CUSTOM_VALUE_MAP
  | FETCH_TASK_STATUSES
  | SET_TASK_STATUSES
  | ADD_REJECT_TASK_STATUS_ID
  | REMOVE_REJECT_TASK_STATUS_ID
  | OPEN_CONTROLLER
  | CLOSE_CONTROLLER
  | UPDATE_DATA;
