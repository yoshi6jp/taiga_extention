import React, { createContext, useReducer, useCallback } from 'react';
import { ActionTypes } from './actions';
import {
  initialStateFn,
  IMilestone,
  ICustomAttr,
  ITask,
  ICustomValueMap,
  ITaskStatus
} from './store';
import { reducer } from './reducer';
import _ from 'lodash';
export const baseUrl = (url: string) => `${url.replace(/[¥/]$/, '')}/api/v1`;

const initialState = initialStateFn();
export const RootContext = createContext({
  state: initialState,
  setUrl: (url: string) => {},
  setPid: (pid: string) => {},
  setMid: (mid: string) => {},
  setMilestones: (milestones: IMilestone[]) => {},
  setCustomEid: (custom_eid: string) => {},
  setCustomRid: (custom_rid: string) => {},
  setCustomAttrs: (custom_attrs: ICustomAttr[]) => {},
  setBizDays: (biz_days: string[]) => {},
  addBizDay: (biz_day: string) => {},
  removeBizDay: (biz_day: string) => {},
  setTasks: (tasks: ITask[]) => {},
  setTaskStatus: (tasks: ITaskStatus[]) => {},
  setCustomValueMap: (custom_value_map: ICustomValueMap) => {},
  toggeRejectTaskStatus: (task_status_id: string, is_reject: boolean) => {},
  openController: () => {},
  closeController: () => {},
  updateData: () => {}
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {
    state,
    setUrl: useCallback(
      (url: string) => {
        dispatch({ type: ActionTypes.SET_URL, payload: { url } });
      },
      [dispatch]
    ),
    setPid: useCallback(
      (pid: string) => {
        dispatch({ type: ActionTypes.SET_PID, payload: { pid } });
      },
      [dispatch]
    ),
    setMid: useCallback(
      (mid: string) => {
        dispatch({ type: ActionTypes.SET_MID, payload: { mid } });
      },
      [dispatch]
    ),
    setMilestones: useCallback(
      (milestones: IMilestone[]) => {
        dispatch({ type: ActionTypes.SET_MILESTONES, payload: { milestones } });
      },
      [dispatch]
    ),
    setCustomEid: useCallback(
      (custom_eid: string) => {
        dispatch({ type: ActionTypes.SET_CUSTOM_EID, payload: { custom_eid } });
      },
      [dispatch]
    ),
    setCustomRid: useCallback(
      (custom_rid: string) => {
        dispatch({ type: ActionTypes.SET_CUSTOM_RID, payload: { custom_rid } });
      },
      [dispatch]
    ),
    setCustomAttrs: useCallback(
      (custom_attrs: ICustomAttr[]) => {
        dispatch({
          type: ActionTypes.SET_CUSTOM_ATTRS,
          payload: { custom_attrs }
        });
      },
      [dispatch]
    ),
    setBizDays: useCallback(
      (biz_days: string[]) => {
        dispatch({ type: ActionTypes.SET_BIZ_DAYS, payload: { biz_days } });
      },
      [dispatch]
    ),
    addBizDay: useCallback(
      (biz_day: string) => {
        dispatch({ type: ActionTypes.ADD_BIZ_DAY, payload: { biz_day } });
      },
      [dispatch]
    ),
    removeBizDay: useCallback(
      (biz_day: string) => {
        dispatch({ type: ActionTypes.REMOVE_BIZ_DAY, payload: { biz_day } });
      },
      [dispatch]
    ),
    setTasks: useCallback(
      (tasks: ITask[]) => {
        dispatch({ type: ActionTypes.SET_TASKS, payload: { tasks } });
      },
      [dispatch]
    ),
    setTaskStatus: useCallback(
      (task_status: ITaskStatus[]) => {
        dispatch({
          type: ActionTypes.SET_TASK_STATUS,
          payload: { task_status }
        });
      },
      [dispatch]
    ),

    setCustomValueMap: useCallback(
      (custom_value_map: ICustomValueMap) => {
        dispatch({
          type: ActionTypes.SET_CUSTOM_VALUE_MAP,
          payload: { custom_value_map }
        });
      },
      [dispatch]
    ),
    toggeRejectTaskStatus: useCallback(
      (reject_task_status_id: string, is_reject: boolean) => {
        const type = is_reject
          ? ActionTypes.ADD_REJECT_TASK_STATUS_ID
          : ActionTypes.REMOVE_REJECT_TASK_STATUS_ID;
        dispatch({
          type,
          payload: { reject_task_status_id }
        });
      },
      [dispatch]
    ),
    openController: useCallback(
      () => {
        dispatch({ type: ActionTypes.OPEN_CONTROLLER });
      },
      [dispatch]
    ),
    closeController: useCallback(
      () => {
        dispatch({ type: ActionTypes.CLOSE_CONTROLLER });
      },
      [dispatch]
    ),
    updateData: useCallback(
      () => {
        dispatch({
          type: ActionTypes.UPDATE_DATA
        });
      },
      [dispatch]
    )
  };
  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
};
