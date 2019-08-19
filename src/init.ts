import { Dispatch } from "react";
import { Actions, ActionTypes } from "./actions";
import { getFromStorage, getFromStorageWithSubkey, StorageKey } from "./store";
import _ from "lodash";
const signIn = (dispatch: Dispatch<Actions>) => {
  const username = getFromStorage(StorageKey.USERNAME);
  const password = getFromStorage(StorageKey.PASSWORD);
  dispatch({ type: ActionTypes.SIGN_IN, payload: { username, password } });
};
const syncStorage = (dispatch: Dispatch<Actions>) => {
  const url = getFromStorage(StorageKey.URL);
  const timer_id = getFromStorage(StorageKey.TIMER_ID);
  const pid = getFromStorage(StorageKey.PID);
  const mid = getFromStorage(StorageKey.MID);
  const custom_eid = getFromStorageWithSubkey(StorageKey.CUSTOM_EID, pid);
  const custom_rid = getFromStorageWithSubkey(StorageKey.CUSTOM_RID, pid);
  const biz_days = _.compact(
    getFromStorageWithSubkey(StorageKey.BIZ_DAYS, mid).split(",")
  ).sort();
  const reject_task_status_ids = _.compact(
    getFromStorageWithSubkey(StorageKey.REJECT_TASK_STATUS_IDS, pid).split(",")
  );

  const isOpen = !(url && pid && mid && custom_eid && custom_rid);

  const pomodoro_date = getFromStorage(StorageKey.POMODORO_DATE);
  const pomodoro_number = Number(
    getFromStorage(StorageKey.POMODORO_NUMBER) || "0"
  );
  const pomodoro_used_number = Number(
    getFromStorage(StorageKey.POMODORO_USED_NUMBER) || "0"
  );
  const task_id = getFromStorage(StorageKey.TASK_ID);
  timer_id &&
    dispatch({ type: ActionTypes.SET_TIMER_ID, payload: { timer_id } });
  url && dispatch({ type: ActionTypes.SET_URL, payload: { url } });
  pid && dispatch({ type: ActionTypes.SET_PID, payload: { pid } });
  mid && dispatch({ type: ActionTypes.SET_MID, payload: { mid } });
  custom_eid &&
    dispatch({ type: ActionTypes.SET_CUSTOM_EID, payload: { custom_eid } });
  custom_rid &&
    dispatch({ type: ActionTypes.SET_CUSTOM_RID, payload: { custom_rid } });
  biz_days.length &&
    dispatch({ type: ActionTypes.SET_BIZ_DAYS, payload: { biz_days } });
  reject_task_status_ids.length &&
    dispatch({
      type: ActionTypes.SET_REJECT_TASK_STATUS_IDS,
      payload: { reject_task_status_ids }
    });

  task_id && dispatch({ type: ActionTypes.SET_TASK_ID, payload: { task_id } });
  isOpen && dispatch({ type: ActionTypes.OPEN_CONTROLLER });
  pomodoro_date &&
    dispatch({
      type: ActionTypes.RESTORE_POMODORO,
      payload: { pomodoro_date, pomodoro_number, pomodoro_used_number }
    });
  dispatch({ type: ActionTypes.LOADED });
  dispatch({ type: ActionTypes.LOAD_POMODORO_TOTALS });
};
export const init = (dispatch: Dispatch<Actions>) => {
  syncStorage(dispatch);
  _.defer(() => {
    signIn(dispatch);
  });
};
