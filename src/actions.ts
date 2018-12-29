export enum ActionTypes {
  SET_URL = 'SET_URL',
  SET_PID = 'SET_PID',
  SET_MID = 'SET_MID',
  SET_MILESTONES = 'SET_MILESTONES',
  SET_CUSTOM_EID = 'SET_CUSTOM_EID',
  SET_CUSTOM_RID = 'SET_CUSTOM_RID',
  SET_CUSTOM_ATTRS = 'SET_CUSTOM_ATTRS',
  SET_BIZ_DAYS = 'SET_BIZ_DAYS',
  ADD_BIZ_DAY = 'ADD_BIZ_DAY',
  REMOVE_BIZ_DAY = 'REMOVE_BIZ_DAY',
  SET_TASKS = 'SET_TASKS',
  SET_CUSTOM_VALUE_MAP = 'SET_CUSTOM_VALUE_MAP'
}

export interface IAction {
  type: ActionTypes;
  payload?: any;
  meta?: { [key: string]: any };
}
