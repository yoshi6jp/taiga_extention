import _ from 'lodash';
import { initialStateFn, IState, StorageKey } from './store';
import { ActionTypes, IAction } from './actions';
import {
  setToStorage,
  setToStorageWithSubkey,
  getFromStorageWithSubkey
} from './store';
export const reducer = (state = initialStateFn(), action: IAction) => {
  switch (action.type) {
    case ActionTypes.SET_URL: {
      const { url } = action.payload;
      setToStorage(StorageKey.URL, url);
      return { ...state, url } as IState;
    }
    case ActionTypes.SET_PID: {
      const { pid } = action.payload;
      setToStorage(StorageKey.PID, pid);
      return {
        ...state,
        pid,
        mid: '',
        custom_eid: getFromStorageWithSubkey(StorageKey.CUSTOM_EID, pid),
        custom_rid: getFromStorageWithSubkey(StorageKey.CUSTOM_RID, pid),
        custom_attrs: [],
        milestones: [],
        custom_value_map: new WeakMap()
      } as IState;
    }
    case ActionTypes.SET_MID: {
      const { mid } = action.payload;
      setToStorage(StorageKey.MID, mid);
      return {
        ...state,
        mid,
        tasks: [],
        biz_days: _.compact(
          getFromStorageWithSubkey(StorageKey.BIZ_DAYS, mid).split(',')
        ).sort()
      } as IState;
    }
    case ActionTypes.SET_MILESTONES: {
      const { milestones } = action.payload;
      return { ...state, milestones } as IState;
    }
    case ActionTypes.SET_CUSTOM_EID: {
      const { custom_eid } = action.payload;
      setToStorageWithSubkey(StorageKey.CUSTOM_EID, state.pid, custom_eid);
      return { ...state, custom_eid } as IState;
    }
    case ActionTypes.SET_CUSTOM_ATTRS: {
      const { custom_attrs } = action.payload;
      return { ...state, custom_attrs } as IState;
    }
    case ActionTypes.SET_CUSTOM_RID: {
      const { custom_rid } = action.payload;
      setToStorageWithSubkey(StorageKey.CUSTOM_RID, state.pid, custom_rid);
      return { ...state, custom_rid } as IState;
    }
    case ActionTypes.SET_BIZ_DAYS: {
      const { biz_days } = action.payload;
      setToStorageWithSubkey(
        StorageKey.BIZ_DAYS,
        state.mid,
        biz_days.join(',')
      );
      return { ...state, biz_days } as IState;
    }
    case ActionTypes.ADD_BIZ_DAY: {
      const { biz_day } = action.payload;
      const biz_days = _.chain([...state.biz_days, biz_day])
        .uniq()
        .sort()
        .value();
      setToStorageWithSubkey(
        StorageKey.BIZ_DAYS,
        state.mid,
        biz_days.join(',')
      );
      return { ...state, biz_days } as IState;
    }
    case ActionTypes.REMOVE_BIZ_DAY: {
      const { biz_day } = action.payload;
      const biz_days = _.reject([...state.biz_days], item => item === biz_day);
      setToStorageWithSubkey(
        StorageKey.BIZ_DAYS,
        state.mid,
        biz_days.join(',')
      );
      return { ...state, biz_days } as IState;
    }
    case ActionTypes.SET_TASKS: {
      const { tasks } = action.payload;
      return { ...state, tasks } as IState;
    }
    case ActionTypes.SET_CUSTOM_VALUE_MAP: {
      const { custom_value_map } = action.payload;
      return { ...state, custom_value_map } as IState;
    }
    case ActionTypes.SET_REJECT_TASK_STATUS_IDS: {
      const { reject_task_status_ids } = action.payload;
      setToStorageWithSubkey(
        StorageKey.REJECT_TASK_STATUS_IDS,
        state.pid,
        reject_task_status_ids.join(',')
      );
      return { ...state, reject_task_status_ids } as IState;
    }
    case ActionTypes.ADD_REJECT_TASK_STATUS_ID: {
      const { reject_task_status_id } = action.payload;
      const reject_task_status_ids = _.chain([
        ...state.reject_task_status_ids,
        reject_task_status_id
      ])
        .compact()
        .uniq()
        .value();
      setToStorageWithSubkey(
        StorageKey.REJECT_TASK_STATUS_IDS,
        state.pid,
        reject_task_status_ids.join(',')
      );
      return { ...state, reject_task_status_ids } as IState;
    }
    case ActionTypes.REMOVE_REJECT_TASK_STATUS_ID: {
      const { reject_task_status_id } = action.payload;
      const reject_task_status_ids = _.reject(
        [...state.reject_task_status_ids],
        item => item === reject_task_status_id
      );
      setToStorageWithSubkey(
        StorageKey.REJECT_TASK_STATUS_IDS,
        state.pid,
        reject_task_status_ids.join(',')
      );
      return { ...state, reject_task_status_ids } as IState;
    }
    case ActionTypes.UPDATE_DATA: {
      return { ...state, updated_time: Date.now() } as IState;
    }
    default: {
      return state;
    }
  }
};
