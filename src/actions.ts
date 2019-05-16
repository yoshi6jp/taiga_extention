import {
  IProject,
  IMilestone,
  ICustomAttr,
  ITask,
  ICustomValueMap,
  ITaskStatus,
  IUser
} from "./store";

export enum ActionTypes {
  SET_URL = "SET_URL",
  SIGN_IN = "SIGN_IN",
  SET_AUTH_TOKEN = "SET_AUTH_TOKEN",
  SET_AUTH_ERROR = "SET_AUTH_ERROR",
  SIGN_OUT = "SIGN_OUT",
  FETCH_PROJECTS = "FETCH_PROJECTS",
  SET_PROJECTS = "SET_PROJECTS",
  SET_PID = "SET_PID",
  FETCH_PROJECT = "FETCH_PROJECT",
  SET_PROJECT = "SET_PROJECT",
  FETCH_MILESTONES = "FETCH_MILESTONES",
  SET_MID = "SET_MID",
  SET_MILESTONES = "SET_MILESTONES",
  SET_CUSTOM_EID = "SET_CUSTOM_EID",
  SET_CUSTOM_RID = "SET_CUSTOM_RID",
  FETCH_CUSTOM_ATTRS = "FETCH_CUSTOM_ATTRS",
  SET_CUSTOM_ATTRS = "SET_CUSTOM_ATTRS",
  SET_CUSTOM_ATTR_E = "SET_CUSTOM_ATTR_E",
  SET_CUSTOM_ATTR_R = "SET_CUSTOM_ATTR_R",
  SET_BIZ_DAYS = "SET_BIZ_DAYS",
  ADD_BIZ_DAY = "ADD_BIZ_DAY",
  REMOVE_BIZ_DAY = "REMOVE_BIZ_DAY",
  FETCH_TASKS = "FETCH_TASKS",
  SET_TASKS = "SET_TASKS",
  PATCH_TASK = "PATCH_TASK",
  FETCH_TASK_STATUSES = "FETCH_TASK_STATUSES",
  SET_TASK_STATUSES = "SET_TASK_STATUSES",
  SET_ACTIVE_TASK_STATUSES = "SET_ACTIVE_TASK_STATUSES",
  FETCH_CUSTOM_VALUE_MAP = "FETCH_CUSTOM_VALUE_MAP",
  SET_CUSTOM_VALUE_MAP = "SET_CUSTOM_VALUE_MAP",
  PATCH_CUSTOM_VALUE = "PATCH_CUSTOM_VALUE",
  FETCH_USER = "FETCH_USER",
  SET_USER = "SET_USER",
  RESET_USER = "RESET_USER",
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
export interface SIGN_IN extends IAction {
  type: ActionTypes.SIGN_IN;
  payload: { username: string; password: string };
}
export interface SET_AUTH_TOKEN extends IAction {
  type: ActionTypes.SET_AUTH_TOKEN;
  payload: { auth_token: string };
}
export interface SET_AUTH_ERROR extends IAction {
  type: ActionTypes.SET_AUTH_ERROR;
}
export interface SIGN_OUT extends IAction {
  type: ActionTypes.SIGN_OUT;
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
export interface FETCH_PROJECT extends IAction {
  type: ActionTypes.FETCH_PROJECT;
  payload: { pid: string };
}
export interface SET_PROJECT extends IAction {
  type: ActionTypes.SET_PROJECT;
  payload: { project: IProject };
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
export interface SET_CUSTOM_ATTR_E extends IAction {
  type: ActionTypes.SET_CUSTOM_ATTR_E;
  payload: { custom_attr_e: ICustomAttr };
}
export interface SET_CUSTOM_ATTR_R extends IAction {
  type: ActionTypes.SET_CUSTOM_ATTR_R;
  payload: { custom_attr_r: ICustomAttr };
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

export interface PATCH_TASK extends IAction {
  type: ActionTypes.PATCH_TASK;
  payload: { key: keyof ITask; value: ITask[keyof ITask]; id: number };
}
export interface FETCH_CUSTOM_VALUE_MAP extends IAction {
  type: ActionTypes.FETCH_CUSTOM_VALUE_MAP;
  payload: { tasks: ITask[] };
}
export interface SET_CUSTOM_VALUE_MAP extends IAction {
  type: ActionTypes.SET_CUSTOM_VALUE_MAP;
  payload: { custom_value_map: ICustomValueMap };
}
export interface PATCH_CUSTOM_VALUE extends IAction {
  type: ActionTypes.PATCH_CUSTOM_VALUE;
  payload: {
    id: string | number;
    key: string;
    value: string | number;
    version: number;
  };
}
export interface FETCH_TASK_STATUSES extends IAction {
  type: ActionTypes.FETCH_TASK_STATUSES;
  payload: { project: string };
}
export interface SET_TASK_STATUSES extends IAction {
  type: ActionTypes.SET_TASK_STATUSES;
  payload: { task_statuses: ITaskStatus[] };
}
export interface SET_ACTIVE_TASK_STATUSES extends IAction {
  type: ActionTypes.SET_ACTIVE_TASK_STATUSES;
  payload: { active_task_statuses: ITaskStatus[] };
}

export interface FETCH_USER extends IAction {
  type: ActionTypes.FETCH_USER;
  payload: { uid: string };
}
export interface SET_USER extends IAction {
  type: ActionTypes.SET_USER;
  payload: { user: IUser };
}
export interface RESET_USER extends IAction {
  type: ActionTypes.RESET_USER;
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
  | SIGN_IN
  | SET_AUTH_TOKEN
  | SET_AUTH_ERROR
  | SIGN_OUT
  | FETCH_PROJECTS
  | SET_PROJECTS
  | SET_PID
  | FETCH_PROJECT
  | SET_PROJECT
  | FETCH_MILESTONES
  | SET_MILESTONES
  | SET_MID
  | SET_CUSTOM_EID
  | SET_CUSTOM_RID
  | FETCH_CUSTOM_ATTRS
  | SET_CUSTOM_ATTRS
  | SET_CUSTOM_ATTR_E
  | SET_CUSTOM_ATTR_R
  | PATCH_CUSTOM_VALUE
  | SET_BIZ_DAYS
  | SET_BIZ_DAYS
  | ADD_BIZ_DAY
  | REMOVE_BIZ_DAY
  | FETCH_TASKS
  | SET_TASKS
  | PATCH_TASK
  | FETCH_CUSTOM_VALUE_MAP
  | SET_CUSTOM_VALUE_MAP
  | FETCH_TASK_STATUSES
  | SET_TASK_STATUSES
  | SET_ACTIVE_TASK_STATUSES
  | FETCH_USER
  | SET_USER
  | RESET_USER
  | ADD_REJECT_TASK_STATUS_ID
  | REMOVE_REJECT_TASK_STATUS_ID
  | OPEN_CONTROLLER
  | CLOSE_CONTROLLER
  | UPDATE_DATA;
