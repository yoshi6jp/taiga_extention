// import _ from "lodash";

import { store } from "./store";
import { settingActions } from "../features/setting/settingSlice";
import { milestoneActions } from "../features/milestone/milestoneSlice";
export enum StorageKey {
  URL = "taiga_url",
  TIMER_ID = "taiga_timer_id",
  PID = "taiga_pid",
  MID = "taiga_mid",
  TASK_ID = "taiga_task_id",
  CUSTOM_EID = "taiga_custom_eid",
  CUSTOM_RID = "taiga_custom_rid",
  BIZ_DAYS = "taiga_biz_days",
  REJECT_TASK_STATUS_IDS = "reject_task_status_ids",
  USERNAME = "taiga_username",
  PASSWORD = "taiga_password",
  POMODORO_DATE = "taiga_pomodoro_date",
  POMODORO_NUMBER = "taiga_pomodoro_number",
  POMODORO_USED_NUMBER = "taiga_pomodoro_used_number",
  TIMELIMIT_CLOSE_TASK = "taiga_timelimit_close_task"
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
export const syncStorage = () => {
  const { dispatch } = store
  const url = getFromStorage(StorageKey.URL);
  // const timer_id = getFromStorage(StorageKey.TIMER_ID);
  // const pid = getFromStorage(StorageKey.PID);
  const mid = getFromStorage(StorageKey.MID);
  // const custom_eid = getFromStorageWithSubkey(StorageKey.CUSTOM_EID, pid);
  // const custom_rid = getFromStorageWithSubkey(StorageKey.CUSTOM_RID, pid);
  // const biz_days = _.compact(
  //   getFromStorageWithSubkey(StorageKey.BIZ_DAYS, mid).split(",")
  // ).sort();
  // const reject_task_status_ids = _.compact(
  //   getFromStorageWithSubkey(StorageKey.REJECT_TASK_STATUS_IDS, pid).split(",")
  // );

  // const isOpen = !(url && pid && mid && custom_eid && custom_rid);

  // const pomodoro_date = getFromStorage(StorageKey.POMODORO_DATE);
  // const pomodoro_number = Number(
  //   getFromStorage(StorageKey.POMODORO_NUMBER) || "0"
  // );
  // const pomodoro_used_number = Number(
  //   getFromStorage(StorageKey.POMODORO_USED_NUMBER) || "0"
  // );
  // const task_id = getFromStorage(StorageKey.TASK_ID);
  // timer_id &&
  //   dispatch({ type: ActionTypes.SET_TIMER_ID, payload: { timer_id } });
  // url && dispatch({ type: ActionTypes.SET_URL, payload: { url } });
  url && dispatch(settingActions.setUrl(url))
  // pid && dispatch({ type: ActionTypes.SET_PID, payload: { pid } });
  // mid && dispatch({ type: ActionTypes.SET_MID, payload: { mid } });
  mid && dispatch(milestoneActions.setMid(mid))
  // custom_eid &&
  //   dispatch({ type: ActionTypes.SET_CUSTOM_EID, payload: { custom_eid } });
  // custom_rid &&
  //   dispatch({ type: ActionTypes.SET_CUSTOM_RID, payload: { custom_rid } });
  // biz_days.length &&
  //   dispatch({ type: ActionTypes.SET_BIZ_DAYS, payload: { biz_days } });
  // reject_task_status_ids.length &&
  //   dispatch({
  //     type: ActionTypes.SET_REJECT_TASK_STATUS_IDS,
  //     payload: { reject_task_status_ids }
  //   });

  // task_id && dispatch({ type: ActionTypes.SET_TASK_ID, payload: { task_id } });
  // isOpen && dispatch({ type: ActionTypes.OPEN_CONTROLLER });
  // pomodoro_date &&
  //   dispatch({
  //     type: ActionTypes.RESTORE_POMODORO,
  //     payload: { pomodoro_date, pomodoro_number, pomodoro_used_number }
  //   });
  // dispatch({ type: ActionTypes.LOADED });
  // dispatch({ type: ActionTypes.LOAD_POMODORO_TOTALS });
}