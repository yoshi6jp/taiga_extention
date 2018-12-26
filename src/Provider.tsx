import React, { createContext, useReducer, useCallback } from 'react';
import _ from 'lodash';
import { IMilestore } from './MilestoneSelector';
import { ICustomAttr } from './CustomValuesSelector';
export interface ICustomValue {
  attributes_values: {
    [key: number]: string;
  };
}
export interface ITask {
  id: number;
  assigned_to: number | null;
  created_date: string;
  finished_date: string;
  is_closed: boolean;
  subject: string;
}
interface IState {
  url: string;
  pid: string;
  mid: string;
  custom_eid: string;
  custom_rid: string;
  custom_attrs: ICustomAttr[];
  biz_days: string[];
  milestones: IMilestore[];
  tasks: ITask[];
  custom_value_map: WeakMap<ITask, ICustomValue>;
}

interface IAction {
  type: Actions;
  payload?: any;
}
enum StorKey {
  URL = 'taiga_url',
  PID = 'taiga_pid',
  MID = 'taiga_mid',
  CUSTOM_EID = 'taiga_custom_eid',
  CUSTOM_RID = 'taiga_custom_rid',
  BIZ_DAYS = 'taiga_biz_days'
}
export const baseUrl = (url: string) => `${url.replace(/[¥/]$/, '')}/api/v1`;
const url = localStorage.getItem(StorKey.URL) || '';
const pid = localStorage.getItem(StorKey.PID) || '';
const mid = localStorage.getItem(StorKey.MID) || '';
const custom_eid = localStorage.getItem(StorKey.CUSTOM_EID) || '';
const custom_rid = localStorage.getItem(StorKey.CUSTOM_RID) || '';
const biz_days_str = localStorage.getItem(StorKey.BIZ_DAYS);
const biz_days = _.isEmpty(biz_days_str)
  ? []
  : (biz_days_str as string).split(',');
const initialState: IState = {
  url,
  pid,
  mid,
  custom_eid,
  custom_rid,
  custom_attrs: [],
  biz_days,
  milestones: [],
  tasks: [],
  custom_value_map: new WeakMap()
};
export const RootContext = createContext({
  state: initialState,
  setUrl: (url: string) => {},
  setPid: (pid: string) => {},
  setMid: (mid: string) => {},
  setMilestones: (milestones: IMilestore[]) => {},
  setCustomEid: (custom_eid: string) => {},
  setCustomRid: (custom_rid: string) => {},
  setCustomAttrs: (custom_attrs: ICustomAttr[]) => {},
  setBizDays: (biz_days: string[]) => {},
  setTasks: (tasks: ITask[]) => {},
  setCustomValueMap: (custom_value_map: WeakMap<ITask, ICustomValue>) => {}
});
export enum Actions {
  SET_URL = 'SET_URL',
  SET_PID = 'SET_PID',
  SET_MID = 'SET_MID',
  SET_MILESTONES = 'SET_MILESTONES',
  SET_CUSTOM_EID = 'SET_CUSTOM_EID',
  SET_CUSTOM_RID = 'SET_CUSTOM_RID',
  SET_CUSTOM_ATTRS = 'SET_CUSTOM_ATTRS',
  SET_BIZ_DAYS = 'SET_BIZ_DAYS',
  SET_TASKS = 'SET_TASKS',
  SET_CUSTOM_VALUE_MAP = 'SET_CUSTOM_VALUE_MAP'
}
const reducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case Actions.SET_URL: {
      const { url } = action.payload;
      return { ...state, url } as IState;
    }
    case Actions.SET_PID: {
      const { pid } = action.payload;
      return { ...state, pid } as IState;
    }
    case Actions.SET_MID: {
      const { mid } = action.payload;
      return { ...state, mid } as IState;
    }
    case Actions.SET_MILESTONES: {
      const { milestones } = action.payload;
      return { ...state, milestones } as IState;
    }
    case Actions.SET_CUSTOM_EID: {
      const { custom_eid } = action.payload;
      return { ...state, custom_eid } as IState;
    }
    case Actions.SET_CUSTOM_ATTRS: {
      const { custom_attrs } = action.payload;
      return { ...state, custom_attrs } as IState;
    }
    case Actions.SET_CUSTOM_RID: {
      const { custom_rid } = action.payload;
      return { ...state, custom_rid } as IState;
    }
    case Actions.SET_BIZ_DAYS: {
      const { biz_days } = action.payload;
      return { ...state, biz_days } as IState;
    }
    case Actions.SET_TASKS: {
      const { tasks } = action.payload;
      return { ...state, tasks } as IState;
    }
    case Actions.SET_CUSTOM_VALUE_MAP: {
      const { custom_value_map } = action.payload;
      return { ...state, custom_value_map } as IState;
    }
    default: {
      return state;
    }
  }
};
export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {
    state,
    setUrl: useCallback(
      (url: string) => {
        dispatch({ type: Actions.SET_URL, payload: { url } });
        localStorage.setItem(StorKey.URL, url);
      },
      [dispatch]
    ),
    setPid: useCallback(
      (pid: string) => {
        dispatch({ type: Actions.SET_PID, payload: { pid } });
        localStorage.setItem(StorKey.PID, pid);
      },
      [dispatch]
    ),
    setMid: useCallback(
      (mid: string) => {
        dispatch({ type: Actions.SET_MID, payload: { mid } });
        localStorage.setItem(StorKey.MID, mid);
      },
      [dispatch]
    ),
    setMilestones: useCallback(
      (milestones: IMilestore[]) => {
        dispatch({ type: Actions.SET_MILESTONES, payload: { milestones } });
      },
      [dispatch]
    ),
    setCustomEid: useCallback(
      (custom_eid: string) => {
        dispatch({ type: Actions.SET_CUSTOM_EID, payload: { custom_eid } });
        localStorage.setItem(StorKey.CUSTOM_EID, custom_eid);
      },
      [dispatch]
    ),
    setCustomRid: useCallback(
      (custom_rid: string) => {
        dispatch({ type: Actions.SET_CUSTOM_RID, payload: { custom_rid } });
        localStorage.setItem(StorKey.CUSTOM_RID, custom_rid);
      },
      [dispatch]
    ),
    setCustomAttrs: useCallback(
      (custom_attrs: ICustomAttr[]) => {
        dispatch({ type: Actions.SET_CUSTOM_ATTRS, payload: { custom_attrs } });
      },
      [dispatch]
    ),
    setBizDays: useCallback(
      (biz_days: string[]) => {
        dispatch({ type: Actions.SET_BIZ_DAYS, payload: { biz_days } });
        localStorage.setItem(StorKey.BIZ_DAYS, biz_days.join(','));
      },
      [dispatch]
    ),
    setTasks: useCallback(
      (tasks: ITask[]) => {
        dispatch({ type: Actions.SET_TASKS, payload: { tasks } });
      },
      [dispatch]
    ),
    setCustomValueMap: useCallback(
      (custom_value_map: WeakMap<ITask, ICustomValue>) => {
        dispatch({
          type: Actions.SET_CUSTOM_VALUE_MAP,
          payload: { custom_value_map }
        });
      },
      [dispatch]
    )
  };
  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
};
