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

  isOpen && dispatch({ type: ActionTypes.OPEN_CONTROLLER });
};
export const init = (dispatch: Dispatch<Actions>) => {
  syncStorage(dispatch);
  signIn(dispatch);
};
