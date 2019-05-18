export interface ICustomAttr {
  id: number;
  name: string;
}
export interface IAuthToken {
  auth_token: string;
}
export interface IMilestone {
  id: number;
  name: string;
  estimated_start: string;
  estimated_finish: string;
  slug: string;
  project: number;
  project_extra_info: IProjectExtraInfo;
}
export interface IProjectExtraInfo {
  id: number;
  name: string;
  slug: string;
}
interface IStatusExtraInfo {
  name: string;
  is_closed: boolean;
}
export interface IUserStoryExtraInfo {
  id: number;
  subject: string;
  epics: any;
  ref: number;
}
export interface ITask {
  id: number;
  assigned_to: number | null;
  created_date: string;
  finished_date: string;
  is_closed: boolean;
  subject: string;
  ref: number;
  project: number;
  project_extra_info: IProjectExtraInfo;
  status: number;
  status_extra_info: IStatusExtraInfo;
  user_story: number;
  user_story_extra_info: IUserStoryExtraInfo;
  version: number;
}
export interface ITasksByUserStory {
  user_story: number;
  user_story_extra_info: IUserStoryExtraInfo;
  project_extra_info: IProjectExtraInfo;
  tasks: ITask[];
  is_closed: boolean;
}
export interface ITaskStatus {
  id: number;
  color: string;
  name: string;
  order: number;
  project: number;
  is_closed: boolean;
  slug: string;
}
export interface IAttrValue {}
export interface ICustomValue {
  attributes_values: {
    [key: number]: string;
  };
  version: number;
}
export interface IUser {
  id: number;
  username: string;
  full_name: string;
  full_name_display: string;
  photo: string;
}
export interface IProject {
  id: number;
  name: string;
  members: IUser[];
}
export type ICustomValueMap = WeakMap<ITask, ICustomValue>;
export interface IState {
  url: string;
  auth_token: string;
  auth_error: boolean;
  username: string;
  password: string;
  user: IUser | null;
  projects: IProject[];
  pid: string; // url
  project: IProject;
  mid: string; // url
  custom_eid: string; //  pid
  custom_rid: string; // pid
  custom_attrs: ICustomAttr[]; // pid
  custom_attr_e: ICustomAttr;
  custom_attr_r: ICustomAttr;
  biz_days: string[]; //mid
  milestones: IMilestone[]; // pid
  milestone: IMilestone;
  tasks: ITask[]; //mid
  user_tasks: ITask[];
  task_statuses: ITaskStatus[];
  active_task_statuses: ITaskStatus[];
  custom_value_map: ICustomValueMap; // pid
  reject_task_status_ids: string[]; // pid
  updated_time: number;
  isOpen: boolean;
}

export enum StorageKey {
  URL = "taiga_url",
  PID = "taiga_pid",
  MID = "taiga_mid",
  CUSTOM_EID = "taiga_custom_eid",
  CUSTOM_RID = "taiga_custom_rid",
  BIZ_DAYS = "taiga_biz_days",
  REJECT_TASK_STATUS_IDS = "reject_task_status_ids",
  USERNAME = "taiga_username",
  PASSWORD = "taiga_password"
}

const _getFromStorage = (key: string) => localStorage.getItem(key) || "";
export const getFromStorage = (key: StorageKey) => _getFromStorage(key);
export const getFromStorageWithSubkey = (key: StorageKey, subkey: string) =>
  subkey ? _getFromStorage(`${subkey}/${key}`) : "";

export const setToStorage = (key: string, item: string) => {
  localStorage.setItem(key, item);
};
export const setToStorageWithSubkey = (
  key: StorageKey,
  subkey: string,
  item: string
) => (subkey ? setToStorage(`${subkey}/${key}`, item) : null);
export const initialState: IState = {
  url: "",
  auth_token: "",
  auth_error: false,
  username: "",
  password: "",
  user: null,
  projects: [],
  pid: "",
  project: {} as IProject,
  mid: "",
  custom_eid: "",
  custom_rid: "",
  custom_attrs: [],
  custom_attr_e: {} as ICustomAttr,
  custom_attr_r: {} as ICustomAttr,
  biz_days: [],
  milestones: [],
  milestone: {} as IMilestone,
  tasks: [],
  user_tasks: [],
  task_statuses: [],
  active_task_statuses: [],
  custom_value_map: new WeakMap(),
  reject_task_status_ids: [],
  updated_time: 0,
  isOpen: false
};
